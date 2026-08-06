import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useAuthStore } from "./store/auth.store";
import LoginPage from "./pages/LoginPage"
import RegisterPage   from './pages/RegisterPage';
import BoardsPage     from './pages/BoardsPage';
import BoardDetailPage from './pages/BoardDetailPage';
import Navbar         from './components/Navbar';

const queryClient = new QueryClient()

const ProtectedRoute = ({ children } : { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  const initialize = useAuthStore((s) => s.initialize)

  useEffect(() => {
    initialize()
  })
}