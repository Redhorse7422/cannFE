import type {
  Ad,
  AdFilterValues,
  AdsListResponse,
  AdResponse,
  CreateAdData,
  UpdateAdData,
  AdStats,
} from '@/types/ad'

import { client } from '@/libs/axios'

// CRUD Operations
export const getAds = async (filters?: AdFilterValues): Promise<AdsListResponse> => {
  const params = new URLSearchParams()

  if (filters?.search) params.append('search', filters.search)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.placementKey) params.append('placementKey', filters.placementKey)
  if (filters?.sellerId) params.append('sellerId', filters.sellerId)
  if (filters?.customerId) params.append('customerId', filters.customerId)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)
  if (filters?.sortBy) params.append('sortBy', filters.sortBy)
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

  const response = await client.get(`/v1/ads?${params.toString()}`)
  return response.data
}

export const getAd = async (id: string): Promise<AdResponse> => {
  const response = await client.get(`/v1/ads/${id}`)
  return response.data
}

export const createAd = async (data: CreateAdData): Promise<AdResponse> => {
  const response = await client.post('/v1/ads', data)
  return response.data
}

export const updateAd = async (id: string, data: UpdateAdData): Promise<AdResponse> => {
  const response = await client.put(`/v1/ads/${id}`, data)
  return response.data
}

export const deleteAd = async (id: string): Promise<void> => {
  await client.delete(`/v1/ads/${id}`)
}

// Stats
export const getAdStats = async (): Promise<{ data: AdStats }> => {
  const response = await client.get('/v1/ads/stats')
  return response.data
}

// Ads API object for consistent interface
export const adsApi = {
  getAll: getAds,
  getById: getAd,
  create: createAd,
  update: updateAd,
  delete: deleteAd,
  getStats: getAdStats,
}

export default adsApi
