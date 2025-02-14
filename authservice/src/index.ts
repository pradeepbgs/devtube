import { Diesel, type ContextType } from "diesel-core";
import connectDB from "./db/connection";
import { UserController } from "./controller/user.controller";
import { UserService } from "./service/user.service";
import { UserRepository } from "./repository/user.repository";
import { securityMiddleware } from "diesel-core/security";
import { cors } from "diesel-core/cors";

const app = new Diesel();
const port = process.env.PORT ?? 3001;

const log = (level: string, message: string, meta?: object) => {
    console.log(JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...meta }));
};

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.use(
    cors({
        origin: ["http://localhost:8080"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(securityMiddleware);

app
    .setupFilter()
    .routeMatcher("/api/v1/user/register", "/api/v1/user/login")
    .permitAll();

connectDB()
    .then((db) => log("info", `MongoDB connected`, { host: db.connection.host }))
    .catch((error) => log("error", "MongoDB Connection Failed", { error: error.message }));

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
});

app.addHooks("onError", (error: any, req: Request, url: URL) => {
    log("error", "Unhandled Error", {
        message: error.message,
        stack: error.stack,
        method: req.method,
        url,
    });
});

app.addHooks("routeNotFound", (ctx: ContextType) => {
    log("warn", "Route Not Found", { url: ctx.req.url, method: ctx.req.method });
    return ctx.json({ message: "Route not found" }, 404);
});

app.post("/api/v1/user/login", userController.LoginUser);
app.post("/api/v1/user/register", userController.RegisterUser);

app.listen(port, () => log("info", `Server started on port ${port}`));
