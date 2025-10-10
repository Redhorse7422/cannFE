'use client'
import type { McdArticleDocument, McdLcdDocument, McdContractor, McdResponseToComment } from '@/types/mcd'

import React, { useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'

import { McdArticleDetail, McdLcdDetail } from '@/components/Pages/Buyer/McdPage/components/McdDetailContent'
import { getMcdDetail } from '@/services/mcd.services'

export default function McdDetailPage() {
  const params = useParams()
  const router = useRouter()
  const documentType = params.documentType as string
  const documentId = params.documentId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [articleData, setArticleData] = useState<{
    document: McdArticleDocument
    contractors: McdContractor[]
    responseToComments?: McdResponseToComment[]
  } | null>(null)
  const [lcdData, setLcdData] = useState<{
    document: McdLcdDocument
    contractors: McdContractor[]
  } | null>(null)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await getMcdDetail(documentType, documentId)

        // Handle the response structure
        if (response?.data?.document) {
          if (documentType.toLowerCase() === 'article') {
            setArticleData({
              document: response.data.document,
              contractors: response.data.related?.contractors || [],
              responseToComments: response.data.related?.responseToComments || [],
            })
          } else if (documentType.toLowerCase() === 'lcd') {
            setLcdData({
              document: response.data.document,
              contractors: response.data.related?.contractors || [],
            })
          }
        } else {
          setError('Invalid response format')
        }
      } catch (err: any) {
        console.error('Error fetching MCD detail:', err)
        setError(err?.message || 'Failed to load document details')
      } finally {
        setLoading(false)
      }
    }

    if (documentType && documentId) {
      fetchDetail()
    }
  }, [documentType, documentId])

  if (loading) {
    return (
      <div className='mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8'>
        <div className='flex items-center justify-center py-20'>
          <div className='space-y-4 text-center'>
            <div className='flex items-center justify-center space-x-2'>
              <div className='h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]'></div>
              <div className='h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]'></div>
              <div className='h-3 w-3 animate-bounce rounded-full bg-primary'></div>
            </div>
            <p className='text-gray-600 dark:text-gray-400'>Loading document details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8'>
        <button
          onClick={() => router.back()}
          className='mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
        >
          <FiArrowLeft className='h-5 w-5' />
          <span>Back to Search</span>
        </button>
        <div className='rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/20'>
          <div className='flex items-start gap-3'>
            <FiAlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400' />
            <div>
              <h3 className='font-semibold text-red-800 dark:text-red-300'>Error Loading Document</h3>
              <p className='mt-1 text-sm text-red-700 dark:text-red-400'>{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8'>
      <button
        onClick={() => router.back()}
        className='mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
      >
        <FiArrowLeft className='h-5 w-5' />
        <span>Back to Search</span>
      </button>

      {articleData && (
        <McdArticleDetail
          document={articleData.document}
          contractors={articleData.contractors}
          responseToComments={articleData.responseToComments}
        />
      )}

      {lcdData && <McdLcdDetail document={lcdData.document} contractors={lcdData.contractors} />}
    </div>
  )
}
