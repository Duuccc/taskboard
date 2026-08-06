import { describe, it, expect, vi, beforeEach } from "vitest"
import { mockResult } from "../helper.js"

vi.mock("../../db/index", () => ({
    query: vi.fn()
}))

vi.mock("../../jobs/queue", () => ({
    emailQueue: { add: vi.fn() }
}))

import * as authService from "../../services/auth.service.js"
import { query } from "../../db/index.js"

const mockQuery = vi.mocked(query)

describe("auth service", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe("register", () => {
        it("returns user without password", async () => {
            mockQuery.mockResolvedValueOnce(mockResult([{ id: 1, name: "Duc", email: "duc@test.com", created_at: new Date() }]))
            
            const user = await authService.register({
                name: "11",
                email: "duc@test.c11111om",
                password: "123451111116"
            })

            expect(user!.name).toBe("Duc")
            expect(user!.email).toBe("duc@test.com")
            expect(user).not.toHaveProperty("password")
        })

        it("hashes the password before storing", async () => {
            mockQuery.mockResolvedValueOnce(mockResult([
                {
                    id: 1,
                    name: "Duc",
                    email: "duc@test.com",
                    created_at: new Date()
                }
            ]))

            await authService.register({
                name: "Duc",
                email: "duc@test.com",
                password: "123456"
            })

            const calledWith = mockQuery.mock.calls[0][1] as string[]
            const storedPassword = calledWith[2]
            expect(storedPassword).not.toBe("123456")
            expect(storedPassword).toMatch(/^\$2[ab]\$/)
        })
    })

    describe("login", () => {
        it("throws if user not found", async () => {
            mockQuery.mockResolvedValueOnce(mockResult([]))

            await expect(
                authService.login({ email: "nobody@test.com", password: "123456" })
            ).rejects.toThrow("Invalid credentials")
        })

        it("throws if password is wrong", async () => {
            mockQuery.mockResolvedValueOnce(mockResult([{
                id: 1,
                name: "Duc",
                email: "duc@test.com",
                password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
                created_at: new Date()
            }]))

            await expect(authService.login({email: "duc@test.com", password: "wrongpassword"})).rejects.toThrow("Invalid credentials")
        })
    })
})
    



