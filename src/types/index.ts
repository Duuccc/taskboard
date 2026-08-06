export interface User {
    id: number
    name: string
    email: string
    password: string
    created_at: Date
}

export interface Board {
    id: number
    title: string
    owner_id: number
    created_at: Date
}

export type TaskStatus = "todo" | "in_progress" | "done"

export interface Task {
    id: number
    board_id: number
    title: string
    description: string
    status: TaskStatus
    assignee_id: number | null
    due_date: Date | null
    created_at: Date
}

export interface RegisterBody {
    name: string
    email: string
    password: string
}

export interface LoginBody {
    email: string
    password: string
}

export interface CreateTaskBody {
    board_id: number
    title: string
    description?: string
    status?: TaskStatus
    due_date?: Date
}

export interface UpdateTaskBody {
    status?: TaskStatus
    title?: string
    description?: string
}

import type { Request } from "express"

// export interface AuthRequest extends Request {
//     userId: number
// }

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}

export interface JwtPayload {
    userId: number
}

