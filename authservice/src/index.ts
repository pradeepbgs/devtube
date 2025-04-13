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
    console.log(
        '\n' + 
        JSON.stringify({ 
        level, 
        message, 
        timestamp: new Date().toISOString(), 
        ...meta }) 
        + '\n');
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
        "/api/v1/auth/register", 
        "/api/v1/auth/login", 
        "/api/v1/auth/verify-otp",
        "/api/v1/auth/reset-password",
        "/api/v1/auth/request-password-reset",
        "/api/v1/auth/request-verification-otp",
        "/api/v1/auth/verify-otp",
        "/"
    )
    .permitAll()
    .authenticate([verifyJwt])

app.use(advancedLogger(app) as any)

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

import { userRouter } from "./routes/user.route";
import { authRouter } from "./routes/auth.route";
import { advancedLogger } from "diesel-core/logger";

app.route("/api/v1/user",userRouter)
app.route('/api/v1/auth', authRouter)




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
