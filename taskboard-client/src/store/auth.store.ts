import { create } from "zustand"
import type { User } from "../types/index"
import { authApi } from "../api/auth.api"

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    initialize: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    initialize: () => {
        const token = localStorage.getItem("accessToken")
        const user = localStorage.getItem("user")
        if(token && user) {
            set({ user: JSON.parse(user), isAuthenticated: true })
        }
    },

    login: async (email, password) => {
        const { accessToken, refreshToken, user } = await authApi.login(email, password)
        localStorage.setItem("accessToken", accessToken) 
        localStorage.setItem("refreshToken", refreshToken)
        localStorage.setItem("user", JSON.stringify(user))
        set({ user, isAuthenticated: true })
    },

    register: async (name, email, password) => {
        const { accessToken, refreshToken, user } = await authApi.register(name, email, password)
        localStorage.setItem("accessToken", accessToken) 
        localStorage.setItem("refreshToken", refreshToken)
        localStorage.setItem("user", JSON.stringify(user))
        set({ user, isAuthenticated: true })
    },

    logout: async() => {
        await authApi.logout()
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        set({
            user: null,
            isAuthenticated: false
        })
    }
}))