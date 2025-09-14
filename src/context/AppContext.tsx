'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AppContextType {
  selectedFinish: string
  setSelectedFinish: (finish: string) => void
  inventoryCount: number
  setInventoryCount: (count: number) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  anodizeLevel: number
  setAnodizeLevel: (t: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedFinish, setSelectedFinish] = useState('titanium-purple')
  const [inventoryCount, setInventoryCount] = useState(50)
  const [isLoading, setIsLoading] = useState(false)
  const [anodizeLevel, setAnodizeLevel] = useState(0.35)

  // Fetch inventory count on component mount
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventory')
        if (response.ok) {
          const data = await response.json()
          setInventoryCount(data.remaining)
        }
      } catch (error) {
        console.error('Failed to fetch inventory:', error)
        // Fallback to default value
        setInventoryCount(50)
      }
    }

    fetchInventory()
  }, [])

  return (
    <AppContext.Provider
      value={{
        selectedFinish,
        setSelectedFinish,
        inventoryCount,
        setInventoryCount,
        isLoading,
        setIsLoading,
        anodizeLevel,
        setAnodizeLevel,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
