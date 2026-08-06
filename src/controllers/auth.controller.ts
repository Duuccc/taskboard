import type { Request, Response, NextFunction } from 'express'
import * as authService from "../services/auth.service.js"
import type { RegisterBody, LoginBody } from "../types/index.js"

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await authService.register(req.body)
        res.status(201).json(user)
    } catch (err) {
        next(err)
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const result = await authService.login(req.body)
        res.json(result)
    } catch (err) {
        next(err)
    }
}

export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken } = req.body
        if(!refreshToken) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    conmemay: "",
                    message: "Refresh token required"
                }
            })
            return
        }
        const tokens = await authService.refresh(refreshToken)
        res.status(200).json(tokens)
    }catch (err) {
        next(err)
    }
}

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { refreshToken } = req.body
        if(!refreshToken) {
            res.status(400).json({
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Refreshtoken required"
                }
            })
            return
        }
        await authService.logout(refreshToken)
        res.status(204).send()
    } catch(error) {
        next(error)
    }
}