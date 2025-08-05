// Common types used across the application

// ===== PRODUCT TYPES =====
export interface Product {
  id: string
  name: string
  slug: string
  regularPrice: number
  salePrice: number
  rating: number
  reviews: number
  thumbnailImg: any
  badge?: string
  description?: string
  category?: string
  tags?: string[]
  inStock?: boolean
  sku?: string
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
}

// ===== CATEGORY TYPES =====
export interface Category {
  id: string
  name: string
  thumbnailImage: any
  href: string
  count: string
  slug: string
  parentId?: string | null
  description?: string
  parentCategory?: string
  createdAt?: string
  subcategories?: Category[]
  children?: Category[]
}

export interface CategoryData {
  name: string
  image: string
  productCount: string
  description?: string
}

// ===== SORT TYPES =====
export interface SortOption {
  value: string
  label: string
}

// ===== FILTER TYPES =====
export interface AppliedFilters {
  price?: {
    min: number
    max: number
  }
  rating?: number
  availability?: 'in-stock' | 'out-of-stock' | 'all'
  brand?: string[]
  category?: string[]
  tags?: string[]
  [key: string]: any
}

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterGroup {
  name: string
  key: string
  options: FilterOption[]
  type: 'checkbox' | 'radio' | 'range' | 'select'
}

// ===== USER TYPES =====
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'buyer' | 'seller' | 'admin'
  phone?: string
  address?: Address
  preferences?: UserPreferences
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault?: boolean
}

export interface UserPreferences {
  language: string
  currency: string
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  theme: 'light' | 'dark' | 'auto'
}
