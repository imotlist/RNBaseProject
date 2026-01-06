/**
 * ConnectionContext.tsx
 * Manages internet connection state for the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import NetInfo from "@react-native-community/netinfo"

interface ConnectionContextValue {
  isConnected: boolean
  isInternetReachable: boolean
  connectionType: string | null
}

const ConnectionContext = createContext<ConnectionContextValue | undefined>(undefined)

interface ConnectionProviderProps {
  children: ReactNode
}

export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true)
  const [isInternetReachable, setIsInternetReachable] = useState(true)
  const [connectionType, setConnectionType] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false)
      setIsInternetReachable(state.isInternetReachable ?? false)
      setConnectionType(state.type)
    })

    // Get initial state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? false)
      setIsInternetReachable(state.isInternetReachable ?? false)
      setConnectionType(state.type)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <ConnectionContext.Provider
      value={{ isConnected, isInternetReachable, connectionType }}
    >
      {children}
    </ConnectionContext.Provider>
  )
}

export const useConnection = () => {
  const context = useContext(ConnectionContext)
  if (!context) {
    throw new Error("useConnection must be used within ConnectionProvider")
  }
  return context
}

export default ConnectionContext
