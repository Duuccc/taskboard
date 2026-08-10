import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError.js'
import { appendFile } from 'node:fs'

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if(err instanceof AppError){
        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message
            }
        })
        return
    }
    
    if((err as AppError).code === "23505"){
        res.status(409).json({
            error: {
                code: "CONFLICT",
                message: "A record with that value already exists"
            }
        })
        return
    }

    console.error("ERROR: ", err)
    res.status(500).json({
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "something went wrong"
        }
    })
}