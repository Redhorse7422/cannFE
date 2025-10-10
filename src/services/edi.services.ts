import { client } from '@/libs/axios'

export interface EDIProduct {
  sku: string
  upc?: string
  name: string
  regularPrice?: number
  listPrice?: number
  salePrice?: number
  packSize?: number
  stock?: number
  weight?: number
  weightUnit?: string
  length?: number
  width?: number
  height?: number
  dimensionUnit?: string
  attributes?: Record<string, any>
}

export interface EDIPreviewResponse {
  message: string
  preview: {
    totalProducts: number
    products: EDIProduct[]
    metadata?: {
      senderId?: string
      receiverId?: string
      documentType?: string
      timestamp?: string
    }
    parseErrors?: string[]
  }
}

export interface EDIUploadResponse {
  result: {
    createdProducts: number
    updatedProducts: number
  }
  message?: string
}

export interface EDIUploadParams {
  file: File
  autoPublish?: boolean
}

/**
 * Preview EDI file contents before importing
 */
export const previewEDIFile = async (file: File): Promise<EDIPreviewResponse> => {
  const formData = new FormData()
  formData.append('file', file)

  // Use axios client with FormData
  const response = await client.post('/v1/edi/preview', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response
}

/**
 * Upload EDI file to create/update products
 */
export const uploadEDIFile = async ({ file, autoPublish = false }: EDIUploadParams): Promise<EDIUploadResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('autoPublish', String(autoPublish))

  // Use axios client with FormData
  const response = await client.post('/v1/edi/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response
}

