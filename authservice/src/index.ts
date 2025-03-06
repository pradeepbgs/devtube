import { Diesel, type ContextType } from "diesel-core";
import connectDB from "./db/connection";
import { securityMiddleware } from "diesel-core/security";
import { cors } from "diesel-core/cors";
import { fileSaveMiddleware } from "./middleware/saveFile";
import {StartRabbitMQ } from "./service/rabbitMQ/consumer";
import { verifyJwt } from "./middleware/auth.middleware";

const app = new Diesel();
const port = process.env.PORT

const log = (level: string, message: string, meta?: object) => {
    console.log('\n' + JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...meta }) + '\n');
};

// cors
app.use(
    cors({
        origin: ["http://localhost:8080","http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Middlewares
app.use(securityMiddleware);
app.use("/api/v1/user/update", fileSaveMiddleware)


app
    .setupFilter()
    .routeMatcher(
        "/api/v1/user/register", 
        "/api/v1/user/login", 
        "/api/v1/user/verify-otp",
        "/api/v1/user/reset-password",
        "/api/v1/user/request-password-reset",
        "/api/v1/user/request-verification-otp",
        "/api/v1/user/verify-otp"
    )
    .permitAll()
    .authenticate([verifyJwt])

// Hooks setup
app.addHooks("onRequest", async (req: Request, url: URL) => {
    const start = Date.now();

    log("info", "Incoming Request", {
        method: req.method,
        url,
        headers: {
            "user-agent": req.headers.get("user-agent"),
            "content-type": req.headers.get("content-type"),
        },
        body: req.body,
    });

    req.startTime = start;
});

app.addHooks("postHandler", (ctx: ContextType) => {
    const duration = Date.now() - ctx.req.startTime;

    log("info", "Response Sent", {
        url: ctx.req.url,
        // status: ctx.statusCode,
        duration: `${duration}ms`,
    });
})

app.addHooks("onError", (error: any, req: Request, url: URL) => {
    log("error", "Unhandled Error", {
        message: error.message,
        stack: error.stack,
        method: req.method,
        url,
    });
})

app.addHooks("routeNotFound", (ctx: ContextType) => {
    if (ctx.req.url.startsWith('/favicon')) return;
    log("warn", "Route Not Found", { url: ctx.req.url, method: ctx.req.method });
    return ctx.json({ message: "Route not found" }, 404);
})


// Routes setup
app.get("/", (ctx) => {
    return ctx.json({message:"Welcome to auth service"})
})

import userRoute from './routes/route'
app.route("/api/v1/user",userRoute)




await connectDB()
    .then((db) => log("info", `MongoDB connected`, { host: db.connection.host }))
    .then(() => StartRabbitMQ())
    .then(() => app.listen(port,"0.0.0.0",  () => log("info", `Server started on port ${port}`)))
    .catch((error) => {
        log("error", "MongoDB Connection Failed", { error: error.message })
        process.exit(1);
    });



function shutDown(){
    app.close();
    process.exit(0);
}
process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);
