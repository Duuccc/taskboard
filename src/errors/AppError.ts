export class AppError extends Error {
    public statusCode: number
    public code: string

    constructor(message: string, statusCode: number, code: string) {
        super(message)
        this.statusCode = statusCode
        this.code = code

        this.name = "AppError"
        
    }
}

export class NotFoundError extends AppError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404, "NOT_FOUND")
    }
} 

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, "UNAUTHORIZED")
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden"){
        super(message, 403, "FORBIDDEN")
    } 
}

export class ValidationError extends AppError {
    constructor(message = "Validation Error") {
        super(message, 400, "VALIDATION_ERROR")
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict Error") {
        super(message, 409, "CONFLICT")
    }
}