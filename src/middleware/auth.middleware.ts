import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from "../types/index.js"

export const authenticate = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const header = req.headers.authorization
    if(!header) {
        res.status(401).json({ error: "No token provided"})
        return
    }

    const token = header.split(" ")[1]
    if(!token){
        res.status(401).json({ error: "No token provided"})
        return
    }

    try {
        const payload = jwt.verify(
            token!,
            process.env.JWT_ACCESS_SECRET as string
        ) as JwtPayload
        
        req.userId = payload.userId
        next()
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" })
    }
}