import { query } from "../db/index.js"
import type { Board } from "../types/index.js"
import { getCache, setCache, deleteCacheByPattern } from "../cache/cache.js"

const BOARDS_TTL = 60  * 5

export const createBoard = async (title: string, ownerId: number): Promise<Board> => {
    const { rows } = await query<Board>(
        `INSERT INTO boards (title, owner_id) VALUES ($1, $2) RETURNING *`,
        [title, ownerId]
    )
    
    await deleteCacheByPattern(`boards:user:${ownerId}`)
    return rows[0]!
}

export const getBoards = async (ownerId: number): Promise<Board[]> => {
    const cacheKey = `boards:user:${ownerId}`

    const cached = await getCache<Board[]>(cacheKey)
    if(cached) {
        console.log("cache hit: ", cacheKey)
        return cached
    }

    console.log("cache miss: ", cacheKey)
    const { rows } = await query<Board>(
        `SELECT * FROM boards WHERE owner_id = $1 ORDER BY created_at DESC`,
        [ownerId]
    )  

    await setCache(cacheKey, rows, BOARDS_TTL)
    return rows
}

export const deleteBoard = async (id: number, ownerId: number) => {
    await query(
        `DELETE FROM boards WHERE id=$1 AND owner_id = $2`,
        [id, ownerId]
    )
    await deleteCacheByPattern(`boards:user:${ownerId}`)
}