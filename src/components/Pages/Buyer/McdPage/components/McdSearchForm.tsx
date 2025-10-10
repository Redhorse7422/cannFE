import React, { useState } from 'react'

import { FiSearch } from 'react-icons/fi'

import { STATE_FOR_MDC } from '@/constants/states'

interface McdSearchFormProps {
  initialQuery?: string
  initialState?: string
  initialSearchType?: 'keyword' | 'code'
  isLoading?: boolean
  onSearch: (query: string, searchType: 'keyword' | 'code', stateId?: string) => void
}

export const McdSearchForm: React.FC<McdSearchFormProps> = ({
  initialQuery = '',
  initialState = '',
  initialSearchType = 'keyword',
  isLoading = false,
  onSearch,
}) => {
  const [query, setQuery] = useState(initialQuery)
  const [stateId, setStateId] = useState(initialState)
  const [searchType, setSearchType] = useState<'keyword' | 'code'>(initialSearchType)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    onSearch(query.trim(), searchType, stateId || undefined)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-3 dark:bg-dark-2'
    >
      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-6'>
          <div className='md:col-span-1'>
            <label className='mb-2 block text-sm font-medium text-dark dark:text-white'>Search By</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'keyword' | 'code')}
              className='w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary'
            >
              <option value='keyword'>Keyword</option>
              <option value='code'>Code</option>
            </select>
          </div>
          <div className='md:col-span-3'>
            <label className='mb-2 block text-sm font-medium text-dark dark:text-white'>
              {searchType === 'code' ? 'Enter Code' : 'Search Medicare Coverage Database'}
            </label>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4'>
                <FiSearch className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchType === 'code'
                    ? 'e.g., A12345 or L12345'
                    : 'e.g., Spinal Cord Stimulators for Chronic Pain'
                }
                className='w-full rounded-lg border border-stroke bg-transparent py-3 pl-11 pr-4 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary'
              />
            </div>
          </div>
          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-dark dark:text-white'>State (Optional)</label>
            <select
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className='w-full rounded-lg border border-stroke bg-transparent px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary'
            >
              <option value=''>All States</option>
              {STATE_FOR_MDC.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='flex items-start justify-between'>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Search for Local Coverage Determinations (LCDs), National Coverage Determinations (NCDs), and related
            articles
          </p>
          <button
            type='submit'
            disabled={isLoading || !query.trim()}
            className='ml-4 flex shrink-0 items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {isLoading ? (
              <>
                <svg className='h-5 w-5 animate-spin' fill='none' viewBox='0 0 24 24'>
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <FiSearch className='h-5 w-5' />
                Search
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
