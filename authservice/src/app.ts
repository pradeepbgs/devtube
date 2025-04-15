import { Diesel} from "diesel-core";
import { securityMiddleware } from "diesel-core/security";
import { cors } from "diesel-core/cors";
import { verifyJwt } from "./middleware/auth.middleware";
import { rateLimit } from 'diesel-core/ratelimit'
import { userRouter } from "./routes/user.route";
import { authRouter } from "./routes/auth.route";


const app = new Diesel();

// Logger
app.useLogger({ app })

// cors
app.use(
    cors({
        origin: ["http://localhost:8080", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// rate-limit
const limit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "Too many requests, please try again later.",
})

app.use(limit)

// Middlewares
app.use(securityMiddleware);


// Filters
app
    .setupFilter()
    .routeMatcher(
        "/",
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/auth/verify-otp",
        "/api/v1/auth/reset-password",
        "/api/v1/auth/request-password-reset",
        "/api/v1/auth/request-verification-otp",
        "/api/v1/auth/verify-otp",
    )
    .permitAll()
    .authenticate([verifyJwt])

app.get("/", (ctx) => {
    return ctx.json({ message: "Welcome to auth service" })
})


// subrouting
app.route("/api/v1/user", userRouter)
app.route('/api/v1/auth', authRouter)

export {
    app
}
