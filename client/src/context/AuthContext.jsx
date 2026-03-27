import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('taxipoa_token')
    const savedUser = localStorage.getItem('taxipoa_user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password })
    const { token, user } = response.data.data
    localStorage.setItem('taxipoa_token', token)
    localStorage.setItem('taxipoa_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const register = async (email, password, fullName, phone) => {
    const response = await api.post('/api/auth/register', {
      email, password, fullName, phone
    })
    const { token, user } = response.data.data
    localStorage.setItem('taxipoa_token', token)
    localStorage.setItem('taxipoa_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  // ── Google OAuth login ─────────────────────────────────────
  const googleLogin = async (credential) => {
    const response = await api.post('/api/auth/google', { credential })
    const { token, user } = response.data.data
    localStorage.setItem('taxipoa_token', token)
    localStorage.setItem('taxipoa_user', JSON.stringify(user))
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('taxipoa_token')
    localStorage.removeItem('taxipoa_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}