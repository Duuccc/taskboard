import { api } from "./axios"
import type { Board } from "../types"

export const boardsApi = {
    getAll: async (): Promise<Board[]> => {
        const { data } = await api.get<Board[]>("/boards")
        return data
    },

    create: async (title: string): Promise<Board> => {
        const { data } = await api.post<Board>("/boards", { title })
        return data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/boards/${id}`)
    }
}

