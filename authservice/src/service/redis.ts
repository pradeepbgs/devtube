import Redis from "ioredis";

export const redis = new Redis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379"),
});

redis.ping()
    .then((result) => {
        console.log("Redis ping successful:", result);
    })
    .catch((error) => {
        console.error("Redis ping failed:", error);
    });

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

redis.on("connect", ()=>{
    console.log("Redis connected");
})