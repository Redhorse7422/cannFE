import type { McdResult, McdPagination } from '@/types/mcd'

import React, { useState } from 'react'

import { searchMcd } from '@/services/mcd.services'

import { McdResults } from './components/McdResults'
import { McdSearchForm } from './components/McdSearchForm'

export const McdPage: React.FC = () => {
  const [results, setResults] = useState<McdResult[]>([])
  const [pagination, setPagination] = useState<McdPagination | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentSearchValue, setCurrentSearchValue] = useState('')
  const [currentSearchType, setCurrentSearchType] = useState<'keyword' | 'code'>('keyword')
  const [currentStateId, setCurrentStateId] = useState<string | undefined>()

  const handleSearch = async (
    searchValue: string,
    searchType: 'keyword' | 'code',
    stateId?: string,
    page: number = 1,
  ) => {
    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setCurrentSearchValue(searchValue)
    setCurrentSearchType(searchType)
    setCurrentStateId(stateId)

    try {
      const response = await searchMcd({
        searchValue,
        searchType,
        page,
        limit: 10,
        ...(stateId && { stateId }),
      })
      setResults(response.results)
      setPagination(response.pagination)
    } catch (err) {
      console.error('MCD search error:', err)
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to search Medicare Coverage Database. Please try again.'
      setError(errorMessage)
      setResults([])
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (currentSearchValue) {
      handleSearch(currentSearchValue, currentSearchType, currentStateId, page)
    }
  }

  return (
    <div className='mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Medicare Coverage Database</h1>
        <p className='mt-1 text-gray-600 dark:text-gray-400'>Search LCDs, NCDs, articles and coverage guidance.</p>
      </div>

      <McdSearchForm
        onSearch={(query, searchType, stateId) => handleSearch(query, searchType, stateId, 1)}
        isLoading={isLoading}
      />
      <McdResults
        results={results}
        pagination={pagination}
        hasSearched={hasSearched}
        isLoading={isLoading}
        error={error}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
