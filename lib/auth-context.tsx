"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  avatarUrl: string
  xp: number
  level: number
  streak: number
}

interface AuthContextType {
  user: User | null
  signInMock: () => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_USER: User = {
  id: "mock-user-1",
  name: "Alex Chen",
  avatarUrl: "/professional-avatar.png",
  xp: 850,
  level: 5,
  streak: 7,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mock-user")
    if (stored === "true") {
      const xp = Number.parseInt(localStorage.getItem("user-xp") || "850")
      const level = Math.floor(xp / 200) + 1
      setUser({ ...MOCK_USER, xp, level })
    }
  }, [])

  const signInMock = () => {
    localStorage.setItem("mock-user", "true")
    localStorage.setItem("user-xp", MOCK_USER.xp.toString())
    setUser(MOCK_USER)
  }

  const signOut = () => {
    localStorage.removeItem("mock-user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, signInMock, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
