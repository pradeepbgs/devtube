import amqp, { type Channel, type Connection } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const FILE_UPLOAD_QUEUE = process.env.QUEUE_NAME || "fileUploadQueue";
const EMAIL_QUEUE = process.env.SECOND_QUEUE_NAME || "emailQueue";

let channel:Channel | null
let connection: Connection | null = null;




async function connectRabbitMQ() {
    if (channel) return; 
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        
        await channel.assertQueue(FILE_UPLOAD_QUEUE, { durable: true });
        await channel.assertQueue(EMAIL_QUEUE, { durable: true });

        console.log("✅ RabbitMQ connected, queues ready!");
    } catch (error) {
        console.error("❌ Error in RabbitMQ Producer:", error);
        channel = null;
    }
}

async function sendToQueue(queue:string, data:object){
    if (!channel) {
        console.log("⏳ Connecting to RabbitMQ...");
        await connectRabbitMQ();
    }

    if (!channel) {
        console.error("❌ Failed to connect to RabbitMQ. Message not sent.");
        return;
    }

    if (!data) {
        console.log("⚠ No data to send to queue");
        return;
    }

    try {
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
        console.log(`✅ Message sent to queue: ${queue}`);
    } catch (error) {
        console.error(`❌ Error sending message to queue: ${queue}`, error);
    }

}


export const publishMessage = (message: object) => sendToQueue(FILE_UPLOAD_QUEUE, message);
export const sendToEmailQueue = (message: object) => sendToQueue(EMAIL_QUEUE, message);

