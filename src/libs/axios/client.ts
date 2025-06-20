'use client'

import type { IError } from './type'
import type { AxiosError, AxiosResponse } from 'axios'

import axios from 'axios'

import { signOutAndReLogin } from './nextAuthWithExternalAPI'

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_CLIENT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use(
  async (config) => config,
  async (error: AxiosError): Promise<IError> => Promise.reject(error.response?.data),
)

client.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.config.responseType === 'arraybuffer') return response.data
    return response.data?.data
  },
  async (error: AxiosError): Promise<IError> => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const errorResponse: any = error?.response?.data

    if (['admin'].includes(process.env.TEMPLATE ?? 'admin')) {
      // NOTE: FOR next-auth, If the token is expired, the user will be signed out and redirected to the login page.
      if (errorResponse?.code === 'TOKEN_EXPIRED') await signOutAndReLogin()
    }

    console.error('Axios server error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      responseData: error.response?.data,
    })
    console.error(`Axios server error: ${error.message}`)
    return Promise.reject(errorResponse)
  },
)
