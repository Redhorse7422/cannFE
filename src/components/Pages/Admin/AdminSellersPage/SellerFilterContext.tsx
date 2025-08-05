'use client'
import type { SellerFilterValues } from '@/types/seller'

import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

interface SellerFilterContextType {
  filters: SellerFilterValues
  setFilters: (filters: SellerFilterValues) => void
}

const SellerFilterContext = createContext<SellerFilterContextType | undefined>(undefined)

export const SellerFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<SellerFilterValues>({
    search: '',
    status: '',
    verificationStatus: '',
    businessCity: '',
    businessState: '',
    businessCountry: '',
    dateRange: {
      start: '',
      end: '',
    },
  })

  return <SellerFilterContext.Provider value={{ filters, setFilters }}>{children}</SellerFilterContext.Provider>
}

export const useSellerFilter = () => {
  const context = useContext(SellerFilterContext)
  if (!context) {
    throw new Error('useSellerFilter must be used within SellerFilterProvider')
  }
  return context
}
