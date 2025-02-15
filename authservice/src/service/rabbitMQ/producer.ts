import amqp, { type Channel, type Connection } from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = process.env.QUEUE_NAME || "auth-service-queue";

export const publishMessage = (message: object): void => {
    amqp
        .connect(RABBITMQ_URL)
        .then(async (connection: Connection) => {
            const channel: Channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME, { durable: true });

            channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });

            console.log(`✅ Message sent to queue: ${QUEUE_NAME}`);

            setTimeout(() => {
                channel.close();
                connection.close();
            }, 500);
        })
        .catch((error) => {
            console.error("❌ Error in RabbitMQ Producer:", error);
        });
};
