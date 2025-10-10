import type { ApiResBodyBase } from '@/types/api'

import { client } from '@/libs/axios'

export interface ContactRequest {
  firstName: string
  lastName: string
  email: string
  categoryId: string
  subject: string
  message: string
}

export interface ContactResponse {
  success: boolean
  message: string
}

export const submitContactForm = async (data: ContactRequest): Promise<ContactResponse> => {
  const response = await client.post('/v1/contact', data)
  return response as any
}
