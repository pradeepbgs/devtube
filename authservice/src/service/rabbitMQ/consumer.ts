import amqp, { type Channel, type Connection, type ConsumeMessage } from "amqplib";
import { uploadOnCloudinary } from "../../utils/cloduinary";
import { UserRepository } from "../../repository/user.repository";
import { Types } from "mongoose";
import { CleanUpResource } from "../../utils/cleanup";
import type { UploadApiResponse } from "cloudinary";




const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = process.env.QUEUE_NAME || "auth-service-queue";

const userRepository = UserRepository.getInstance();

export const StartConsuming = async () => {
    try {
        const connection: Connection = await amqp.connect(RABBITMQ_URL);
        const channel: Channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log(`🚀 [*] Waiting for messages in ${QUEUE_NAME}. To exit, press CTRL+C`);

        channel.consume(
            QUEUE_NAME,
            async (msg: ConsumeMessage | null) => {
                if (!msg) return;

                const { userId,avatar, coverImage }: {userId:Types.ObjectId, avatar?: string; coverImage?: string } = JSON.parse(msg.content.toString());

                if (!Types.ObjectId.isValid(userId)) {
                    console.error("❌ Invalid userId:", userId);
                    channel.nack(msg, false, false);
                    return;
                }

                try {
                    await UpdateDB(new Types.ObjectId(userId),avatar, coverImage);
                    channel.ack(msg);
                } catch (error) {
                    console.error("❌ Error processing message:", error);
                }
            },
            { noAck: false }
        );
    } catch (error) {
        console.error("❌ RabbitMQ Consumer Error:", error);
    }
};

const UpdateDB = async (userId:Types.ObjectId,avatar?: string, coverImage?: string) => {
    try {
        
        
        const uploadedData : Record<string,string> = {}

       if (avatar) {
            const avatarResponse: UploadApiResponse | null = await uploadOnCloudinary(avatar);
            if (avatarResponse?.secure_url) {
                uploadedData.avatar = avatarResponse.secure_url;
            }
        }
        
        if (coverImage) {
            const coverImageResponse: UploadApiResponse | null  = await uploadOnCloudinary(coverImage);
            if (coverImageResponse?.secure_url) {
                uploadedData.coverImage = coverImageResponse.secure_url;
            }
        }

        if(Object.keys(uploadedData).length > 0){
            await userRepository.UpdateUser(userId, uploadedData);
            console.log("✅ Upload & Database Update Success:", uploadedData);
        } 
        else {
            console.log("❌ No files uploaded");
        }

    } catch (error) {
        console.error("❌ Error uploading files & user: ", error);
    } finally{
        CleanUpResource(avatar as string,coverImage as string)
    }
};

