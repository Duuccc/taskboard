import { afterAll, beforeAll } from "vitest"
import redis from "../db/redis.js"
import { pool } from "../db/index.js"

beforeAll(async () => {
    if(process.env.NODE_ENV !== "test"){
        throw new Error("Test must run with NODE_ENV=test")
    }
})

afterAll(async () => {
    await redis.quit()
    await pool.end()
})