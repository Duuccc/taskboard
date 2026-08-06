import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { Pool } from "pg"

dotenv.config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(__filename)
console.log(__dirname)

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
})

const run = async () => {
    const migrationDir = path.join(__dirname, "migrations")
    const files = fs.readdirSync(migrationDir).sort()

    for (const file of files) {
        if(!file.endsWith(".sql")) continue
        console.log(`Running migration: ${file}`)

        const sql = fs.readFileSync(path.join(migrationDir, file), "utf-8")
        await pool.query(sql)
        console.log(`Migration ${file} completed.`)
    }

    await pool.end()
    console.log("All migrations completed.")
}

run().catch((err) => {
    console.error("Migration failed:", err)
    process.exit(1)
})