import { app } from "./app";
import connectDB from "./db/connection";
import { StartRabbitMQ } from "./service/rabbitMQ/consumer";

export const log = (level: string, message: string, meta?: object) => {
    console.log(
        '\n' +
        JSON.stringify({
            level,
            message,
            timestamp: new Date().toISOString(),
            ...meta
        })
        + '\n');
};

const port = process.env.PORT


await connectDB()
    .then((db) => log("info", `MongoDB connected`, { host: db.connection.host }))
    .catch((error) => {
        log("error", "MongoDB Connection Failed", { error: error.message })
        process.exit(1);
    })

    .then(() => StartRabbitMQ())
    .catch((error) => {
        log("error", "RabbitMQ Connection Failed", { error: error.message })
        process.exit(1);
    })
    
    .then(() => app.listen(port, "0.0.0.0", () => log("info", `Server started on port ${port}`)))
    .catch((error) => {
        log("error", "MongoDB Connection Failed", { error: error.message })
        process.exit(1);
    });



function shutDown() {
    app.close();
    process.exit(0);
}
process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
