import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "../db/index.js"
import type { User, RegisterBody, LoginBody, JwtPayload } from "../types/index.js"
import { ConflictError, UnauthorizedError } from "../errors/AppError.js"
import { emailQueue } from "../jobs/queue.js"

import crypto from "crypto"

const ACCESS_TOKEN_TTL = "15m"
const REFRESH_TOKEN_TTL = 7

type SafeUser = Omit<User, "password">

const generateTokens = async(userId: number) => {
    const accessToken = jwt.sign(
        { userId } as JwtPayload,
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: ACCESS_TOKEN_TTL }
    )

    const refreshToken = jwt.sign(
        { userId } as JwtPayload,
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: REFRESH_TOKEN_TTL }
    )
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL*24*60*60*1000)

    await query(
        `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
        [userId, refreshToken, expiresAt]
    )

    return { accessToken, refreshToken }
}

export const register = async(body: RegisterBody): Promise<SafeUser|undefined> => {
    const { name, email, password } = body
    const hash = await bcrypt.hash(password, 10)

    const { rows } = await query<SafeUser>(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
        [name, email, hash] 
    )
    const user = rows[0]

    await emailQueue.add("welcome-email", {
        userId: user?.id,
        name: user?.name,
        email: email,
    })

    return user
}

export const login = async (
    body: LoginBody
) => {

    const { rows } = await query<User>("SELECT * FROM users WHERE email = $1", [body.email])
    const user = rows[0]

    if(!user) throw new UnauthorizedError("Invalid credentials")

    const valid = await bcrypt.compare(body.password, user.password)
    if(!valid) throw new UnauthorizedError("Invalid credentials")

    const payload: JwtPayload = { userId: user.id }
    
    const { password: _, ...safeUser } = user
    
    const tokens = await generateTokens(user.id)    

    return { ...tokens, user: safeUser }
}

export const refresh = async (refreshToken: string) => {
    const { rows } = await query<{ user_id: number, expires_at: Date}>(
        `SELECT user_id, expires_at FROM refresh_tokens WHERE token = $1`,
        [refreshToken]
    )

    const stored = rows[0]
    if(!stored){
        throw new UnauthorizedError("Invalid refresh token")
    }
    if(stored.expires_at < new Date()) throw new UnauthorizedError("Refresh Token expired")
    
    await query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken])
    return generateTokens(stored.user_id)
}

export const logout = async (refreshToken: string) => {
    await query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken])
}