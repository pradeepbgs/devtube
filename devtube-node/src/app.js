import express from 'express'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from "url";
import path from 'path';
const app = express()
import dotenev from 'dotenv'
dotenev.config()
import helmet from 'helmet'

// app.use(cors({
//     origin: '*',
//     credentials: true,
// }))


app.use(helmet())
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit:'16kb'}))
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,"../dist")))


// routes import 
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import commentRouter from './routes/comment.routes.js'
import subscriptionRouter from './routes/susbcription.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import likesRouter from './routes/like.routes.js'
import healthcheckRouter from './routes/healthcheck.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import { authRouter } from './routes/auth.routes.js';

// route declaration
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/video', videoRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/subscription', subscriptionRouter)
app.use('/api/v1/tweet',tweetRouter)
app.use('/api/v1/playlist', playlistRouter)
app.use('/api/v1/like', likesRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/dashboard", dashboardRouter)

// app.get("/api/v1/users",(_,res) => {
//     res.json({
//         msg:"Welcome to nodejs service"
//     })
// })

app.get("*",(req,res) =>{
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
})

export default app

