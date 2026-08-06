import type { QueryResult, QueryResultRow } from "pg";
import request from "supertest";
import app from "../app.js";

export const mockResult = <T extends QueryResultRow>(rows: T[]): QueryResult<T> => ({
    rows,
    rowCount: rows.length,
    command: "SELECT",
    oid: 0,
    fields: []
})

export interface TestUser {
    id: number
    accessToken: string
    email: string
}

export const createTestUser = async (
    email = "test@test.com",
    password = "123456"
): Promise<TestUser> => {
    const res1 = await request(app).post("/api/auth/register").send({name: "Test user", email, password})
    console.log(res1.body)
    const res = await request(app).post("/api/auth/login").send({ email, password })
    console.log(res.body)

    return {
        id: res.body.user.id,
        accessToken: res.body.accessToken,
        email
    }
}

export const authGet = (token: string, url: string) => {
    return request(app).get(url).set("authorization", `Bearer ${token}`)
}

export const authPost = (token: string, url: string, body: Record<string, unknown>) => {
    return request(app).post(url).set("authorization", `Bearer ${token}`).send(body)
}