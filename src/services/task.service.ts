import { query } from "../db/index.js";
import type { Task, CreateTaskBody, UpdateTaskBody } from "../types/index.js";
import type { PaginationParams, PaginatedResponse } from "../utils/pagination.js";
import { getCache, setCache, deleteCacheByPattern } from '../cache/cache.js';

const TASKS_TTL = 60 * 2 

export const getTasks = async (
    boardId: number,
    pagination: PaginationParams,
    filters: { status?: string }
): Promise<PaginatedResponse<Task>> => {

    const cacheKey = `tasks:board:${boardId}:page:${pagination.page}:status:${filters.status ?? 'all'}`

    const cached = await getCache<PaginatedResponse<Task>>(cacheKey)
    if(cached) return cached

    const conditions: string[] = ["board_id = $1"]
    const params: unknown[] = [boardId]

    if(filters.status){
        params.push(filters.status)
        conditions.push(`status = $${params.length}`)
    }

    const where = conditions.join(" AND ")

    const countResult = await query<{count: string}>(
        `SELECT COUNT(*) FROM tasks WHERE ${where}`,
        params
    )
    const total = parseInt(countResult.rows[0]!.count)

    params.push(pagination.limit, pagination.offset)
    const { rows } = await query<Task>(
        `SELECT * FROM tasks WHERE ${where}
        ORDER BY created_at DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}`,
        params
    )
    
    const result: PaginatedResponse<Task> = {
        data: rows,
        meta: {
            total,
            page: pagination.page,
            limit: pagination.limit,
            totalPages: Math.ceil(total / pagination.limit),
            hasNext: pagination.page < Math.ceil(total / pagination.limit),
            hasPrev: pagination.page > 1
        }
    }

    await setCache(cacheKey, result, TASKS_TTL)

    return result
}

export const createTask = async (body: CreateTaskBody, userId: number): Promise<Task> => {
    const { rows } = await query<Task>(
        `INSERT INTO tasks (board_id, title, description, status, assignee_id, due_date)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [body.board_id, body.title, body.description ?? null, body.status ?? "todo", userId, body.due_date ?? null]
    )

    await deleteCacheByPattern(`tasks:board:${body.board_id}:*`)
    return rows[0]!
}

export const updateTask = async (id: number, body: UpdateTaskBody): Promise<Task> => {
    const { rows } = await query<Task>(
        `UPDATE tasks
        SET status = COALESCE($1, status),
            title = COALESCE($2, title),
            description = COALESCE($3, description)
        WHERE id = $4 RETURNING *`,
        [body.status ?? null, body.title ?? null, body.description ?? null, id]
    )
    if(!rows[0]) throw new Error("Task not found")

    await deleteCacheByPattern(`tasks:board:${rows[0].board_id}:*`)
    return rows[0]
}

export const deleteTask = async (id: number, userId: number): Promise<void> => {
    const { rows } = await query<Task>(
        `DELETE FROM tasks WHERE id = $1 AND assignee_id = $2 RETURNING *`,
        [id, userId]
    )
    if(rows[0]) {
        await deleteCacheByPattern(`tasks:board:${rows[0].board_id}:*`)
    }
}