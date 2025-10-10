// Ad Management Types

export type AdStatus = 'draft' | 'active' | 'paused' | 'archived'

export type AdPlacementKey =
  | 'homepage_banner'
  | 'homepage_sidebar'
  | 'category_banner'
  | 'category_sidebar'
  | 'category_inline'
  | 'product_detail_sidebar'
  | 'product_detail_inline'
  | 'cart_sidebar'
  | 'checkout_banner'

export interface AdTargeting {
  categorySlug?: string
  productType?: string
  country?: string
  device?: 'desktop' | 'mobile' | 'tablet'
  pagePathPattern?: string
}

export interface Ad {
  id: string
  createdAt: string
  updatedAt: string
  placementKey: AdPlacementKey | string
  sellerId?: string
  customerId?: string
  title: string
  description?: string
  mediaUrl: string
  linkUrl: string
  status: AdStatus
  startAt?: string
  endAt?: string
  weight: number
  maxImpressionsPerDay?: number
  totalImpressions: number
  targeting?: AdTargeting
  seller?: {
    id: string
    businessName: string
    businessEmail?: string
  }
  customer?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface CreateAdData {
  placementKey: string
  sellerId?: string
  customerId?: string
  title: string
  description?: string
  mediaUrl: string
  linkUrl: string
  status?: AdStatus
  startAt?: string
  endAt?: string
  weight?: number
  maxImpressionsPerDay?: number
  targeting?: AdTargeting
}

export interface UpdateAdData {
  placementKey?: string
  sellerId?: string
  customerId?: string
  title?: string
  description?: string
  mediaUrl?: string
  linkUrl?: string
  status?: AdStatus
  startAt?: string
  endAt?: string
  weight?: number
  maxImpressionsPerDay?: number
  targeting?: AdTargeting
}

export interface AdFilterValues {
  search?: string
  status?: AdStatus | string
  placementKey?: string
  sellerId?: string
  customerId?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AdStats {
  total: number
  draft: number
  active: number
  paused: number
  archived: number
  totalImpressions: number
}

export interface AdsListResponse {
  data: Ad[]
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface AdResponse {
  data: Ad
}
