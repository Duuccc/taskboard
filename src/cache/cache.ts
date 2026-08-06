import redis from "../db/redis.js";

export const setCache = async (key: string, value: unknown, ttl: number): Promise<void> => {
    await redis.set(key, JSON.stringify(value), "EX", ttl)
}

export const getCache = async<T>(key: string): Promise<T|null> => {
    const data = await redis.get(key)
    if(!data) return null
    return JSON.parse(data) as T
}

export const deleteCache = async (key:string) => {
    await redis.del(key)
}

export const deleteCacheByPattern = async (pattern: string) => {
    const keys = await redis.keys(pattern)
    if(keys.length > 0) await redis.del(...keys)
}