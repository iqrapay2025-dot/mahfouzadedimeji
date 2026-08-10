import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getCurrentUser, onAuthStateChange, signIn, signOut } from '@/lib/auth'
import type { CurrentUser } from '@/lib/auth'

interface AuthContextType {
  currentUser: CurrentUser | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const updateUser = async () => {
      const user = await getCurrentUser()
      if (!mounted) return
      setCurrentUser(user)
      setLoading(false)
    }

    updateUser()

    const listener = onAuthStateChange(async session => {
      if (!mounted) return
      if (session?.user?.id) {
        const user = await getCurrentUser()
        if (!mounted) return
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })

    return () => {
      mounted = false
      listener.data.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const success = await signIn(email, password)
    if (success) {
      const user = await getCurrentUser()
      setCurrentUser(user)
    }
    return success
  }

  const logout = async () => {
    await signOut()
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.isAdmin === true,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
