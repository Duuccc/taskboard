export interface PaginationParams {
    page: number
    limit: number
    offset: number
}

export interface PaginatedResponse<T> {
    data: T[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

export const parsePagination = (query: Record<string, unknown>): PaginationParams => {
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20))
    return {
        page,
        limit,
        offset: (page - 1)*limit
    }
}