import { client } from '@/libs/axios'

export interface BuyerCategory {
  id: string
  name: string
  slug: string
  description?: string
  longDescription?: string
  isActive: boolean
  isFeatured: boolean
  isPopular: boolean
  createdAt: string
  updatedAt: string
  parent: unknown
  parentId: string | null
  thumbnailImage: {
    id: string
    scope: string
    uri: string | null
    url: string
    fileName: string
    mimetype: string
    size: number
    userId: string | null
    createdAt: string
    updatedAt: string
  }
  sellers: unknown[]
  children: unknown[]
}

export const getBuyerCategories = async (): Promise<BuyerCategory[]> => {
  const response = await client.get('/v1/categories/buyer-categories')
  return response as unknown as BuyerCategory[]
}
