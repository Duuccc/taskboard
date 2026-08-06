import { api } from "./axios";
import type { Task, TaskStatus, PaginatedResponse, UpdateTaskBody } from "../types/index"

interface CreateTaskDto {
    board_id: number
    title: string
    description?: string
    status?: TaskStatus
    due_date?: string
}

export const tasksApi = {
    getByBoard: async (boardId: number, page = 1): Promise<PaginatedResponse<Task>> => {
        const { data } = await api.get<PaginatedResponse<Task>>("/tasks", {
            params: { board_id: boardId, page}
        })
        return data
    },

    create: async (dto: CreateTaskDto): Promise<Task> => {
        const { data } = await api.post<Task>("/tasks", dto)
        return data
    },

    update: async (id: number, updates: UpdateTaskBody): Promise<Task> => {
        const { data } = await api.patch<Task>(`/tasks/${id}`, updates)
        return data
    },

    delete: async(id: number): Promise<void> => {
        await api.delete(`/tasks/${id}`)
    }
}