import { client } from '@/libs/axios'

export interface McdSearchParams {
  searchValue: string
  searchType?: 'keyword' | 'code'
  limit?: number
  page?: number
  documentType?: 'all' | 'lcd' | 'article' | 'ncd'
  stateId?: string
}

export interface McdResult {
  document_type: string
  document_id: string
  title: string
  status: string
}

export interface McdPagination {
  page: number
  limit: string | number
  totalCount: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface McdFilters {
  keyword: string
  documentType: string
}

export interface McdSearchResponse {
  results: McdResult[]
  pagination: McdPagination
  filters: McdFilters
}

export interface McdApiResponse {
  code: number
  message: string
  requestId: string
  data: {
    message: string
    data: McdSearchResponse
  }
}

/**
 * Search Medicare Coverage Database
 */
export const searchMcd = async (params: McdSearchParams): Promise<McdSearchResponse> => {
  const { searchValue, searchType = 'keyword', limit = 10, page = 1, documentType = 'all', stateId } = params

  // Build search params based on search type
  const searchParams: Record<string, string | number> = {
    limit,
    page,
    ...(documentType !== 'all' && { documentType }),
    ...(stateId && { state: stateId }),
  }

  // Add the appropriate search parameter based on type
  if (searchType === 'code') {
    searchParams.code = searchValue
  } else {
    searchParams.keyword = searchValue
  }

  // The axios client interceptor extracts response.data.data
  const response = await client.get('/v1/mcd/search', {
    params: searchParams,
  })

  // Handle different response structures
  if (response && typeof response === 'object') {
    // If response has data property, use it
    if ('data' in response && response.data) {
      return response.data as McdSearchResponse
    }
  }

  // Fallback - return empty response
  return {
    results: [],
    pagination: {
      page: 1,
      limit: 10,
      totalCount: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
    filters: {
      keyword: searchValue,
      documentType: 'all',
    },
  }
}

/**
 * Get MCD Document Detail
 */
export const getMcdDetail = async (documentType: string, documentId: string) => {
  const response = await client.get(`/v1/mcd/${documentType}/${documentId}`)

  // Return the full response with document and related data
  return response
}
