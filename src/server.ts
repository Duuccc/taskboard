import "dotenv/config"
import app from "./app.js"

const requiredEnvVars = ["JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET", "DB_PASS"]

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`))