import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo } from "react"
import { useMMKVString } from "react-native-mmkv"
import { setOnUnauthorizedCallback } from "@/services/api/ApiService"

export interface City {
  id: string
  name: string
  latitude: string
  longitude: string
}

export interface Organization {
  id: string
  name: string
  code: string
}

export interface UserData {
  id: string | number
  name?: string
  username?: string
  email: string
  role?: string
  city_id?: string | number
  avatar?: string
  is_active?: boolean
  city?: City
  organization?: Organization
  created_at?: string
  updated_at?: string
}

export type AuthContextType = {
  isAuthenticated: boolean
  authToken?: string
  authEmail?: string
  user?: UserData | null
  setAuthToken: (token?: string) => void
  setAuthEmail: (email: string) => void
  login: (user: UserData, token?: string) => Promise<void>
  logout: () => void
  validationError: string
}

export const AuthContext = createContext<AuthContextType | null>(null)

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({ children }) => {
  const [authToken, setAuthToken] = useMMKVString("AuthProvider.authToken")
  const [authEmail, setAuthEmail] = useMMKVString("AuthProvider.authEmail")
  const [userJson, setUserJson] = useMMKVString("AuthProvider.user")

  // Parse user from JSON string
  const user = useMemo(() => {
    if (!userJson) return null
    try {
      return JSON.parse(userJson) as UserData
    } catch {
      return null
    }
  }, [userJson])

  const login = useCallback(
    async (userData: UserData, token?: string) => {
      if (token) {
        setAuthToken(token)
      }
      setAuthEmail(userData.email)
      setUserJson(JSON.stringify(userData))
    },
    [setAuthToken, setAuthEmail, setUserJson],
  )

  const logout = useCallback(() => {
    setAuthToken(undefined)
    setAuthEmail("")
    setUserJson(undefined)
  }, [setAuthEmail, setAuthToken, setUserJson])

  // Register the 401 callback with ApiService
  // This ensures AuthContext state is cleared when API returns 401
  useEffect(() => {
    setOnUnauthorizedCallback(logout)
  }, [logout])

  const validationError = useMemo(() => {
    if (!authEmail || authEmail.length === 0) return "can't be blank"
    if (authEmail.length < 6) return "must be at least 6 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)) return "must be a valid email address"
    return ""
  }, [authEmail])

  const value = {
    isAuthenticated: !!authToken,
    authToken,
    authEmail,
    user,
    setAuthToken,
    setAuthEmail,
    login,
    logout,
    validationError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
