import express from "express"
import authRouter from "./routes/auth.route.js"
import tasksRouter from "./routes/task.route.js"
import boardRouter from "./routes/board.route.js"
import { errorHandler } from "./middleware/error.middleware.js"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import "./jobs/email.worker.js"

const app = express()

app.use(helmet())

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        error: {
            code: "RATE_LIMITED",
            message: "Too many requests, try again later"
        }
    }
})

const generalLimiter = rateLimit({
    windowMs: 60*1000,
    max: 100
})

app.use(express.json())

app.use("/api/auth", authLimiter, authRouter)

app.use("/api", generalLimiter)

app.use("/api/tasks", tasksRouter)
app.use("/api/boards", boardRouter)

app.use(errorHandler)

export default app