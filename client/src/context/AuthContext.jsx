import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setUser(null)
      return
    }

    const fetchMe = async () => {
      try {
        setLoading(true)
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.data.data && res.data.data.user) {
          setUser(res.data.data.user)
        }
      } catch {
        setUser(null)
        setToken('')
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [token])

  const login = (newToken, userData) => {
    setToken(newToken)
    setUser(userData)
    localStorage.setItem('token', newToken)
    // Don't fetch /auth/me immediately after login since we already have user data
    // The useEffect will handle it on next render if needed
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


