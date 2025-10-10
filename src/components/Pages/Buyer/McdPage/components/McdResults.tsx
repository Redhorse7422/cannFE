import type { McdResult, McdPagination } from '@/types/mcd'

import React from 'react'

import Link from 'next/link'
import { FiChevronLeft, FiChevronRight, FiFileText, FiAlertCircle } from 'react-icons/fi'

interface McdResultsProps {
  results: McdResult[]
  pagination: McdPagination | null
  hasSearched: boolean
  isLoading: boolean
  error?: string | null
  onPageChange: (page: number) => void
}

const getDocumentTypeDisplay = (type: string): { label: string; color: string } => {
  const typeLower = type.toLowerCase()
  if (typeLower === 'lcd') {
    return { label: 'LCD', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' }
  }
  if (typeLower === 'ncd') {
    return { label: 'NCD', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
  }
  if (typeLower === 'article') {
    return { label: 'Article', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' }
  }
  return { label: type.toUpperCase(), color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
}

const getStatusDisplay = (status: string): { label: string; color: string } => {
  if (status === 'A') {
    return { label: 'Active', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' }
  }
  if (status === 'I') {
    return { label: 'Inactive', color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
  }
  return { label: status, color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' }
}

export const McdResults: React.FC<McdResultsProps> = ({
  results,
  pagination,
  hasSearched,
  isLoading,
  error,
  onPageChange,
}) => {
  // Error state
  if (error) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/20'>
        <div className='flex items-start gap-3'>
          <FiAlertCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400' />
          <div>
            <h3 className='font-semibold text-red-800 dark:text-red-300'>Search Error</h3>
            <p className='mt-1 text-sm text-red-700 dark:text-red-400'>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2'>
        <div className='p-8'>
          <div className='flex items-center justify-center space-x-2'>
            <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]'></div>
            <div className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]'></div>
            <div className='h-2 w-2 animate-bounce rounded-full bg-primary'></div>
          </div>
          <p className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            Searching Medicare Coverage Database...
          </p>
        </div>
      </div>
    )
  }

  // No results state
  if (hasSearched && results.length === 0) {
    return (
      <div className='rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-dark-3 dark:bg-dark-2'>
        <FiFileText className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-600' />
        <h3 className='mt-4 text-lg font-semibold text-gray-900 dark:text-white'>No results found</h3>
        <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
          Try adjusting your search terms or removing filters
        </p>
      </div>
    )
  }

  // Don't show anything if no search has been performed
  if (!hasSearched) {
    return null
  }

  // Results table
  return (
    <div className='space-y-4'>
      {/* Results info */}
      {pagination && (
        <div className='flex items-center justify-between'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Showing <span className='font-medium text-gray-900 dark:text-white'>{results.length}</span> of{' '}
            <span className='font-medium text-gray-900 dark:text-white'>{pagination.totalCount}</span> results
          </p>
        </div>
      )}

      {/* Table */}
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-dark-3 dark:bg-dark-2'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-dark-3'>
            <thead className='bg-gray-50 dark:bg-dark-3'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300'
                >
                  Document ID
                </th>
                <th
                  scope='col'
                  className='px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300'
                >
                  Title
                </th>
                <th
                  scope='col'
                  className='px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300'
                >
                  Type
                </th>
                <th
                  scope='col'
                  className='px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300'
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white dark:divide-dark-3 dark:bg-dark-2'>
              {results.map((result) => {
                const href = `/medicare-coverage-database/${encodeURIComponent(result.document_type)}/${encodeURIComponent(result.document_id)}`
                const docType = getDocumentTypeDisplay(result.document_type)
                const status = getStatusDisplay(result.status)

                return (
                  <tr
                    key={`${result.document_type}-${result.document_id}`}
                    className='transition-colors hover:bg-gray-50 dark:hover:bg-dark-3/50'
                  >
                    <td className='whitespace-nowrap px-6 py-4'>
                      <Link
                        href={href}
                        className='font-medium text-primary transition-colors hover:text-primary/80 hover:underline'
                      >
                        {result.document_id}
                      </Link>
                    </td>
                    <td className='max-w-md px-6 py-4'>
                      <Link
                        href={href}
                        className='line-clamp-2 text-sm text-gray-900 hover:text-primary hover:underline dark:text-gray-100'
                      >
                        {result.title || 'Untitled'}
                      </Link>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${docType.color}`}>
                        {docType.label}
                      </span>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className='flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-dark-3 dark:bg-dark-2 sm:px-6'>
           <div className='flex flex-1 justify-between sm:hidden'>
             <button
               onClick={() => onPageChange(Number(pagination.page) - 1)}
               disabled={!pagination.hasPrev}
               className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300 dark:hover:bg-dark-3'
             >
               Previous
             </button>
             <button
               onClick={() => onPageChange(Number(pagination.page) + 1)}
               disabled={!pagination.hasNext}
               className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-300 dark:hover:bg-dark-3'
             >
               Next
             </button>
           </div>
           <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
             <div>
               <p className='text-sm text-gray-700 dark:text-gray-300'>
                 Page <span className='font-medium'>{Number(pagination.page)}</span> of{' '}
                 <span className='font-medium'>{pagination.totalPages}</span>
               </p>
             </div>
            <div>
               <nav className='isolate inline-flex -space-x-px rounded-md shadow-sm' aria-label='Pagination'>
                 <button
                   onClick={() => onPageChange(Number(pagination.page) - 1)}
                   disabled={!pagination.hasPrev}
                   className='relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-400 dark:hover:bg-dark-3'
                 >
                   <span className='sr-only'>Previous</span>
                   <FiChevronLeft className='h-5 w-5' aria-hidden='true' />
                 </button>

                {/* Page numbers */}
                 {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                   const currentPage = Number(pagination.page)
                   let pageNumber: number
                   if (pagination.totalPages <= 5) {
                     pageNumber = i + 1
                   } else if (currentPage <= 3) {
                     pageNumber = i + 1
                   } else if (currentPage >= pagination.totalPages - 2) {
                     pageNumber = pagination.totalPages - 4 + i
                   } else {
                     pageNumber = currentPage - 2 + i
                   }

                   return (
                     <button
                       key={pageNumber}
                       onClick={() => onPageChange(pageNumber)}
                       className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20 ${
                         pageNumber === currentPage
                           ? 'z-10 border-primary bg-primary/10 text-primary dark:bg-primary/20'
                           : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-400 dark:hover:bg-dark-3'
                       }`}
                     >
                       {pageNumber}
                     </button>
                   )
                 })}

                 <button
                   onClick={() => onPageChange(Number(pagination.page) + 1)}
                   disabled={!pagination.hasNext}
                   className='relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-dark-3 dark:bg-dark-2 dark:text-gray-400 dark:hover:bg-dark-3'
                 >
                   <span className='sr-only'>Next</span>
                   <FiChevronRight className='h-5 w-5' aria-hidden='true' />
                 </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
