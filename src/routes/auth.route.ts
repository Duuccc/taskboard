import Router from 'express'
import * as authController from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.middleware.js'
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from '../validation/auth.schema.js'

const authRouter = Router()

authRouter.post("/register", validate(registerSchema), authController.register)
authRouter.post("/login", validate(loginSchema), authController.login)
authRouter.post("/refresh", validate(refreshSchema), authController.refresh)
authRouter.post("/logout", validate(logoutSchema), authController.logout)

export default authRouter