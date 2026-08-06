import {Pool, type QueryResult, type QueryResultRow} from "pg";

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
})

export const query = <T extends QueryResultRow>(
    text: string,
    params?: unknown[]
): Promise<QueryResult<T>> => pool.query<T>(text, params)

