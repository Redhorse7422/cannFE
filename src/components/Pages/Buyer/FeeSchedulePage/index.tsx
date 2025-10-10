'use client'
import type { FeeScheduleItem, FeeScheduleSearchParams } from '../../../../services/feeSchedule.services'
import type { ApiResBodyBase } from '@/types/api'

import React, { useState } from 'react'

import { SearchIcon } from '@/assets/icons'

import { searchPricingRange, searchPricingSingle } from '../../../../services/feeSchedule.services'

import { FeeScheduleResults } from './components/FeeScheduleResults'
import { FeeScheduleSearchForm } from './components/FeeScheduleSearchForm'

export const FeeSchedulePage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<FeeScheduleSearchParams>({})
  const [results, setResults] = useState<FeeScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(25)
  const [offset, setOffset] = useState(0)

  const handleSearch = async (params: FeeScheduleSearchParams) => {
    console.log('[FeeSchedulePage] handleSearch called with params:', params)
    setIsLoading(true)
    setError(null)
    setSearchParams(params)
    setHasSearched(true)

    try {
      let responseData: FeeScheduleItem[] = []
      const useLimit = params.limit ?? limit
      const useOffset = params.offset ?? offset
      const effectiveModifier = (() => {
        if (params.modifier && params.modifier.trim()) return params.modifier.trim()
        switch (params.modifierOption) {
          case '26':
            return '26'
          case 'tc':
            return 'TC'
          case '53':
            return '53'
          default:
            return undefined
        }
      })()

      // Determine which function to call based on hcpcsMode
      if (params.hcpcsMode === 'single' && params.hcpcs) {
        console.log('[FeeSchedulePage] calling searchPricingSingle for single code:', params.hcpcs)
        const responseSingle: ApiResBodyBase<{
          data: FeeScheduleItem[]
          total: number
          limit: number
          offset: number
        }> = await searchPricingSingle(
          params.hcpcs,
          params.year || '2025',
          params.macOption,
          params.location,
          params.carrier,
          useLimit,
          useOffset,
          params.infoType,
          effectiveModifier,
        )
        if (responseSingle.code === 0 && responseSingle.data) {
          responseData = responseSingle.data.data
          setTotal(responseSingle.data.total)
          setLimit(responseSingle.data.limit)
          setOffset(responseSingle.data.offset)
        } else {
          throw new Error('Failed to fetch data for single HCPCS code')
        }
      } else if (params.hcpcsMode === 'range' && params.hcpcsStart && params.hcpcsEnd) {
        console.log('[FeeSchedulePage] calling searchPricingRange for range:', params.hcpcsStart, 'to', params.hcpcsEnd)
        const responseRange: ApiResBodyBase<{
          data: FeeScheduleItem[]
          total: number
          limit: number
          offset: number
        }> = await searchPricingRange(
          [params.hcpcsStart, params.hcpcsEnd],
          params.year || '2025',
          params.macOption,
          params.location,
          params.carrier,
          useLimit,
          useOffset,
          params.infoType,
          effectiveModifier,
        )
        if (responseRange.code === 0 && responseRange.data) {
          responseData = responseRange.data.data
          setTotal(responseRange.data.total)
          setLimit(responseRange.data.limit)
          setOffset(responseRange.data.offset)
        } else {
          throw new Error('Failed to fetch data for HCPCS range')
        }
      } else if (params.hcpcsMode === 'list' && params.hcpcsList && params.hcpcsList.length > 0) {
        console.log('[FeeSchedulePage] calling searchPricingSingle for list of codes:', params.hcpcsList)
        // For list mode, we'll call searchPricingSingle for each code and combine results
        const listResponses: ApiResBodyBase<{
          data: FeeScheduleItem[]
          total: number
          limit: number
          offset: number
        }>[] = await Promise.all(
          params.hcpcsList.map((code) =>
            searchPricingSingle(
              code,
              params.year || '2025',
              params.macOption,
              params.location,
              params.carrier,
              useLimit,
              useOffset,
              params.infoType,
              effectiveModifier,
            ),
          ),
        )

        // Combine all successful responses
        const allResults: FeeScheduleItem[] = []
        listResponses.forEach((resp) => {
          if (resp.code === 0 && resp.data) {
            allResults.push(...resp.data.data)
          }
        })
        responseData = allResults
      } else {
        throw new Error('Invalid search parameters: missing required HCPCS codes for selected mode')
      }

      console.log('[FeeSchedulePage] results length:', responseData.length)
      setResults(responseData)
    } catch (err) {
      console.error('[FeeSchedulePage] search error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch fee schedule data. Please try again.')
    } finally {
      console.log('[FeeSchedulePage] search finished')
      setIsLoading(false)
    }
  }

  const handleClearSearch = () => {
    console.log('[FeeSchedulePage] clearing search state')
    setSearchParams({})
    setResults([])
    setError(null)
    setHasSearched(false)
    setTotal(0)
    setLimit(25)
    setOffset(0)
  }

  const handlePageChange = async (newOffset: number) => {
    if (isLoading) return
    setIsLoading(true)
    try {
      const params = searchParams
      const useParams: FeeScheduleSearchParams = { ...params, limit, offset: newOffset }
      const effectiveModifier = (() => {
        if (params.modifier && params.modifier.trim()) return params.modifier.trim()
        switch (params.modifierOption) {
          case '26':
            return '26'
          case 'tc':
            return 'TC'
          case '53':
            return '53'
          default:
            return undefined
        }
      })()

      if (params.hcpcsMode === 'single' && params.hcpcs) {
        const responseSingle = await searchPricingSingle(
          params.hcpcs,
          params.year || '2025',
          params.macOption,
          params.location,
          params.carrier,
          useParams.limit || limit,
          newOffset,
          params.infoType,
          effectiveModifier,
        )
        if (responseSingle.code === 0 && responseSingle.data) {
          setResults(responseSingle.data.data)
          setTotal(responseSingle.data.total)
          setLimit(responseSingle.data.limit)
          setOffset(responseSingle.data.offset)
        }
      } else if (params.hcpcsMode === 'range' && params.hcpcsStart && params.hcpcsEnd) {
        const responseRange = await searchPricingRange(
          [params.hcpcsStart, params.hcpcsEnd],
          params.year || '2025',
          params.macOption,
          params.location,
          params.carrier,
          useParams.limit || limit,
          newOffset,
          params.infoType,
          effectiveModifier,
        )
        if (responseRange.code === 0 && responseRange.data) {
          setResults(responseRange.data.data)
          setTotal(responseRange.data.total)
          setLimit(responseRange.data.limit)
          setOffset(responseRange.data.offset)
        }
      } else if (params.hcpcsMode === 'list' && params.hcpcsList && params.hcpcsList.length > 0) {
        const listResponses = await Promise.all(
          params.hcpcsList.map((code) =>
            searchPricingSingle(
              code,
              params.year || '2025',
              params.macOption,
              params.location,
              params.carrier,
              useParams.limit || limit,
              newOffset,
              params.infoType,
              effectiveModifier,
            ),
          ),
        )
        const allResults: FeeScheduleItem[] = []
        let totalFromFirst = total
        listResponses.forEach((resp, idx) => {
          if (resp.code === 0 && resp.data) {
            allResults.push(...resp.data.data)
            if (idx === 0) totalFromFirst = resp.data.total
          }
        })
        setResults(allResults)
        setTotal(totalFromFirst)
        setOffset(newOffset)
      }
    } catch (err) {
      console.error('[FeeSchedulePage] pagination fetch error:', err)
      setError('Failed to fetch next page. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header Section */}
      <div className='bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-gray-900 sm:text-4xl'>Medicare Physician Fee Schedule</h1>
            <p className='mt-4 text-lg text-gray-600'>
              Search and view Medicare payment rates for healthcare services and procedures
            </p>
            <div className='mt-6 flex items-center justify-center gap-2 text-sm text-blue-600'>
              <span>Data provided by</span>
              <a
                href='https://pfs.data.cms.gov/'
                target='_blank'
                rel='noopener noreferrer'
                className='font-medium hover:underline'
              >
                CMS PFS Look-Up Tool
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-8 rounded-lg bg-white p-6 shadow-sm'>
          <FeeScheduleSearchForm
            onSearch={handleSearch}
            onClear={handleClearSearch}
            isLoading={isLoading}
            initialValues={searchParams}
          />
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className='rounded-lg bg-white shadow-sm'>
            <div className='border-b border-gray-200 px-6 py-4'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Search Results
                {results.length > 0 && (
                  <span className='ml-2 text-sm font-normal text-gray-500'>
                    ({total} {total > 0 ? 'results' : 'result'})
                  </span>
                )}
              </h2>
            </div>

            {isLoading ? (
              <div className='flex items-center justify-center py-12'>
                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary'></div>
                  <span className='text-gray-600'>Searching fee schedule...</span>
                </div>
              </div>
            ) : error ? (
              <div className='px-6 py-12 text-center'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
                  <svg className='h-6 w-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-gray-900'>Search Error</h3>
                <p className='mt-2 text-gray-600'>{error}</p>
                <button
                  onClick={() => handleSearch(searchParams)}
                  className='mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'
                >
                  Try Again
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className='px-6 py-12 text-center'>
                <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100'>
                  <SearchIcon className='h-6 w-6 text-gray-400' />
                </div>
                <h3 className='text-lg font-medium text-gray-900'>No Results Found</h3>
                <p className='mt-2 text-gray-600'>
                  No fee schedule items match your search criteria. Try adjusting your search parameters.
                </p>
              </div>
            ) : (
              <FeeScheduleResults
                results={results}
                total={total}
                limit={limit}
                offset={offset}
                infoType={searchParams.infoType}
                onPrev={() => handlePageChange(Math.max(0, offset - limit))}
                onNext={() => handlePageChange(offset + limit)}
                onPageChange={(page) => {
                  const newOffset = (page - 1) * limit
                  if (newOffset !== offset) handlePageChange(newOffset)
                }}
              />
            )}
          </div>
        )}

        {/* Information Section */}
        {!hasSearched && (
          <div className='mt-8 rounded-lg bg-blue-50 p-6'>
            <h3 className='mb-4 text-lg font-semibold text-blue-900'>About the Medicare Physician Fee Schedule</h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div>
                <h4 className='mb-2 font-medium text-blue-800'>What is the PFS?</h4>
                <p className='text-sm text-blue-700'>
                  The Medicare Physician Fee Schedule (PFS) is a comprehensive listing of maximum fees used by Medicare
                  to reimburse physicians and other healthcare providers for their services.
                </p>
              </div>
              <div>
                <h4 className='mb-2 font-medium text-blue-800'>How to Use This Tool</h4>
                <p className='text-sm text-blue-700'>
                  Search by HCPCS code, procedure description, or modifier to find payment rates, RVUs, and other
                  important billing information for Medicare services.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
