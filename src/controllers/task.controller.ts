import type { Request, Response, NextFunction } from 'express'
import { query } from "../db/index.js"
import type { Task, CreateTaskBody, UpdateTaskBody } from "../types/index.js"
import { parsePagination } from '../utils/pagination.js'
import * as tasksService from "../services/task.service.js"

export const getTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const pagination = parsePagination(req.query)
        const filters = { status: req.query.status as string }
        const result = await tasksService.getTasks(Number(req.query.board_id), pagination, filters)
        res.json(result)
    } catch (err) {
        next(err)
    }
}

export const createTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { board_id, title, description, status = 'todo', due_date } = req.body as CreateTaskBody
        const { rows } = await query<Task>(
            `INSERT INTO tasks (board_id, title, description, status, assignee_id, due_date) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [board_id, title, description ?? null, status, req.userId, due_date ?? null]
        )
        res.status(201).json(rows[0])
    } catch (err) {
        next(err)
    }
}

export const updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { status, title, description } = req.body as UpdateTaskBody
        const { rows } = await query<Task>(
            `UPDATE tasks
            SET status = COALESCE($1, status),
                title = COALESCE($2, title),
                description = COALESCE($3, description)
            WHERE id = $4 RETURNING *`,
            [status ?? null, title ?? null, description ?? null, req.params.id]
        )
        if(!rows[0]) {
            res.status(404).json({ error: 'Task not found' })
            return
        }
        res.json(rows[0])
    }catch (err) {
        next(err)
    }
}

export const deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await query("DELETE FROM tasks WHERE id = $1 AND asignee_id = $2", [req.params.id, req.userId])
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}