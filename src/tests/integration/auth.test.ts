import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest"
import app from "../../app.js"
import { query } from "../../db/index.js"
import { exactOptional } from "zod";

beforeEach(async () => {
    await query("DELETE FROM tasks")
    await query("DELETE FROM boards")
    await query("DELETE FROM users")
})

describe("POST /api/auth/register", () => {
    it("creates a user and returns 201", async () => {
        const res = await request(app).post("/api/auth/register").send({ name: "Duc", email: "duc@test.com", password: "123456"})
    
        expect(res.status).toBe(201)
        expect(res.body.email).toBe("duc@test.com")
        expect(res.body).not.toHaveProperty("password")
    })

    it("returns 409 if email already exists", async () => {
        await request(app).post("/api/auth/register").send({ name: "Duc", email: "duc@test.com", password: "123456" })

        const res = await request(app).post("/api/auth/register").send({ name: "Duc", email: "duc@test.com", password: "123456" })

        expect(res.status).toBe(409)
    })

    it("returns 400 if email is invalid", async () => {
        const res = await request(app).post("/api/auth/register").send({ name: "Duc", email: "notanemail", password: "123456"})

        expect(res.status).toBe(400)
        expect(res.body.error.code).toBe("VALIDATION_ERROR")
    })
})

describe("POST /api/auth/login", () => {
    it("returns tokens on valid credentials", async () => {
        await request(app).post("/api/auth/register").send({ name: "Duc", email: "duc@test.com", password: "123456"})

        const res = await request(app).post("/api/auth/login").send({ email: "duc@test.com", password: "123456" })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("accessToken")
        expect(res.body).toHaveProperty("refreshToken")
        expect(res.body.user.email).toBe("duc@test.com")
    })

    it("returns 401 on wrong password", async () => {
        await request(app).post("/api/auth/register").send({ name: "Duc", email: "duc@test.com", password: "123456"})

        const res = await request(app).post("/api/auth/login").send({ email: "duc@test.com", password: "wrongpassword" })

        console.log(res.body)
        expect(res.status).toBe(401)
    })
})