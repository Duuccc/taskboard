import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password must be at least 1 characters")
})

export type registerSchemaType = z.infer<typeof registerSchema>

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password must be at least 1 characters ")
})

export type loginSchemaType = z.infer<typeof loginSchema>

export const refreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
})

export const logoutSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required")
})