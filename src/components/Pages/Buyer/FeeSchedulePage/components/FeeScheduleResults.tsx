'use client'
import type { FeeScheduleItem } from '../../../../../services/feeSchedule.services'

import React, { useState } from 'react'

import { ChevronDownIcon, ChevronUpIcon, InformationCircleIcon } from '@/assets/icons'

interface FeeScheduleResultsProps {
  results: FeeScheduleItem[]
  total: number
  limit: number
  offset: number
  onPrev: () => void
  onNext: () => void
  onPageChange: (page: number) => void // 1-based
  infoType?: 'pricing' | 'policy' | 'rvu' | 'gpci' | 'all'
}

export const FeeScheduleResults: React.FC<FeeScheduleResultsProps> = ({
  results,
  total,
  limit,
  offset,
  onPrev,
  onNext,
  onPageChange,
  infoType,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<
    'hcpcs' | 'description' | 'fac_price' | 'nfac_price' | 'fac_limiting_charge' | 'nfac_limiting_charge'
  >('hcpcs')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const toggleExpanded = (hcpcs: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(hcpcs)) newExpanded.delete(hcpcs)
    else newExpanded.add(hcpcs)
    setExpandedItems(newExpanded)
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortBy) {
      case 'hcpcs':
        aValue = a.hcpcs ?? ''
        bValue = b.hcpcs ?? ''
        break
      case 'description':
        aValue = a.description ?? ''
        bValue = b.description ?? ''
        break
      case 'fac_price':
        aValue = a.fac_price
        bValue = b.fac_price
        break
      case 'nfac_price':
        aValue = a.nfac_price
        bValue = b.nfac_price
        break
      case 'fac_limiting_charge':
        aValue = a.fac_limiting_charge
        bValue = b.fac_limiting_charge
        break
      case 'nfac_limiting_charge':
        aValue = a.nfac_limiting_charge
        bValue = b.nfac_limiting_charge
        break
      default:
        return 0
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
    }
    return 0
  })

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)

  const getSortIcon = (field: typeof sortBy) => {
    if (sortBy !== field) return <div className='h-4 w-4' />
    return sortOrder === 'asc' ? <ChevronUpIcon className='h-4 w-4' /> : <ChevronDownIcon className='h-4 w-4' />
  }

  // RVU-only simplified table
  if (infoType === 'rvu') {
    const currentPage = Math.floor(offset / limit) + 1
    const totalPages = Math.max(1, Math.ceil(total / limit))
    return (
      <div className='overflow-hidden'>
        <div className='border-b border-gray-200 bg-gray-50 px-6 py-3'>
          <div className='grid grid-cols-7 gap-6 text-sm font-medium text-gray-700'>
            <div>HCPCS Code</div>
            <div>Description</div>
            <div className='text-right'>Status</div>
            <div className='text-right'>Trans Non-Fac PE RVU</div>
            <div className='text-right'>Trans Fac PE RVU</div>
            <div className='text-right'>MP RVU</div>
            <div />
          </div>
        </div>

        <div className='divide-y divide-gray-200'>
          {results.map((item, index) => {
            const key = (item.hcpc || item.hcpcs || index.toString()) as string
            const transNfac = (item as unknown as Record<string, string | number>).trans_nfac_pe as
              | string
              | number
              | undefined
            const transFac = (item as unknown as Record<string, string | number>).trans_fac_pe as
              | string
              | number
              | undefined
            const rvuMp = (item as unknown as Record<string, string | number>).rvu_mp as string | number | undefined
            return (
              <div key={key} className='bg-white'>
                <div className='px-6 py-4 hover:bg-gray-50'>
                  <div className='grid grid-cols-7 items-center gap-6 text-sm'>
                    <div>
                      <span className='inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800'>
                        {item.hcpc || item.hcpcs}
                      </span>
                      <div className='mt-1 text-xs text-gray-500'>Status: {item.proc_stat || item.status}</div>
                    </div>
                    <div className='truncate font-medium text-gray-900'>
                      {item.sdesc || item.nused_for_med || item.description}
                    </div>
                    <div className='text-right'>{item.proc_stat || item.status}</div>
                    <div className='text-right font-medium'>{transNfac ?? '-'}</div>
                    <div className='text-right font-medium'>{transFac ?? '-'}</div>
                    <div className='text-right font-medium'>{rvuMp ?? '-'}</div>
                    <div />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className='flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='text-sm text-gray-600'>
            {(() => {
              const start = total === 0 ? 0 : Math.min(total, offset + 1)
              const end = Math.min(total, offset + results.length)
              return `Showing ${start}–${end} of ${total}`
            })()}
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Page</span>
            <select
              className='rounded-md border border-gray-300 bg-white px-2 py-1 text-sm'
              value={currentPage}
              onChange={(e) => onPageChange(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span className='text-sm text-gray-600'>of {totalPages}</span>
            <div className='flex gap-2'>
              <button
                onClick={onPrev}
                disabled={offset <= 0}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  offset <= 0
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={onNext}
                disabled={offset + limit >= total}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  offset + limit >= total
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='overflow-hidden'>
      {/* Header / Sort Controls */}
      <div className='border-b border-gray-200 bg-gray-50 px-6 py-3'>
        <div className='grid grid-cols-7 gap-6 text-sm font-medium text-gray-700'>
          <button onClick={() => handleSort('hcpcs')} className='flex items-center gap-1'>
            HCPCS Code {getSortIcon('hcpcs')}
          </button>
          <button onClick={() => handleSort('description')} className='flex items-center gap-1'>
            Description {getSortIcon('description')}
          </button>
          <button onClick={() => handleSort('nfac_price')} className='flex items-center justify-end gap-1'>
            Non Facility Fee {getSortIcon('nfac_price')}
          </button>
          <button onClick={() => handleSort('fac_price')} className='flex items-center justify-end gap-1'>
            Facility Fee {getSortIcon('fac_price')}
          </button>
          <button onClick={() => handleSort('nfac_limiting_charge')} className='flex items-center justify-end gap-1'>
            Non-Facility Limiting Charge {getSortIcon('nfac_limiting_charge')}
          </button>
          <button onClick={() => handleSort('fac_limiting_charge')} className='flex items-center justify-end gap-1'>
            Facility Limiting Charge {getSortIcon('fac_limiting_charge')}
          </button>
          <div /> {/* More column */}
        </div>
      </div>

      {/* Results List */}
      <div className='divide-y divide-gray-200'>
        {sortedResults.map((item, index) => {
          const key = item.hcpc || item.hcpcs || index.toString()
          const isExpanded = expandedItems.has(key)

          return (
            <div key={key} className='bg-white'>
              <div className='px-6 py-4 hover:bg-gray-50'>
                <div className='grid grid-cols-7 items-center gap-6 text-sm'>
                  {/* HCPCS */}
                  <div>
                    <span className='inline-flex items-center rounded-md bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800'>
                      {item.hcpc || item.hcpcs}
                    </span>
                    <div className='mt-1 text-xs text-gray-500'>Status: {item.status || item.proc_stat}</div>
                  </div>

                  {/* Description */}
                  <div className='truncate font-medium text-gray-900'>
                    {item.sdesc || item.nused_for_med || item.description}
                  </div>

                  {/* Fees */}
                  <div className='text-right font-medium'>{formatCurrency(item.nfac_price)}</div>
                  <div className='text-right font-medium'>{formatCurrency(item.fac_price)}</div>
                  <div className='text-right font-medium'>{formatCurrency(item.nfac_limiting_charge)}</div>
                  <div className='text-right font-medium'>{formatCurrency(item.fac_limiting_charge)}</div>

                  {/* Expand Button */}
                  <div className='text-right'>
                    <button
                      onClick={() => toggleExpanded(key)}
                      className='ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700'
                    >
                      {isExpanded ? 'Less' : 'More'}
                      {isExpanded ? <ChevronUpIcon className='h-4 w-4' /> : <ChevronDownIcon className='h-4 w-4' />}
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className='border-t border-gray-200 bg-gray-50 px-6 py-4'>
                  <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                    {/* RVU Information */}
                    <div>
                      <h4 className='mb-3 text-sm font-medium text-gray-900'>Relative Value Units (RVUs)</h4>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Work RVU:</span>
                          <span className='font-medium'>{item.rvuWork}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Practice RVU:</span>
                          <span className='font-medium'>{item.rvuPractice}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Malpractice RVU:</span>
                          <span className='font-medium'>{item.rvuMalpractice}</span>
                        </div>
                        <div className='flex justify-between border-t border-gray-200 pt-2 text-sm font-medium'>
                          <span className='text-gray-900'>Total RVU:</span>
                          <span className='text-primary'>{item.totalRvu}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h4 className='mb-3 text-sm font-medium text-gray-900'>Payment Information</h4>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Facility Fee:</span>
                          <span className='font-medium'>{formatCurrency(item.fac_limiting_charge)}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Non-Facility Fee:</span>
                          <span className='font-medium'>{formatCurrency(item.nfac_limiting_charge)}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Fee Difference:</span>
                          <span className='font-medium'>
                            {formatCurrency(Math.abs(item.nfac_limiting_charge - item.fac_limiting_charge))}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Information */}
                    <div>
                      <h4 className='mb-3 text-sm font-medium text-gray-900'>Status Information</h4>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Status:</span>
                          <span
                            className={`font-medium ${item.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>Effective Date:</span>
                          <span className='font-medium'>{new Date(item.effectiveDate).toLocaleDateString()}</span>
                        </div>
                        {item.endDate && (
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>End Date:</span>
                            <span className='font-medium'>{new Date(item.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div>
                      <h4 className='mb-3 text-sm font-medium text-gray-900'>Additional Information</h4>
                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-600'>HCPCS Code:</span>
                          <span className='font-mono font-medium'>{item.hcpcs}</span>
                        </div>
                        {item.modifier && (
                          <div className='flex justify-between text-sm'>
                            <span className='text-gray-600'>Modifier:</span>
                            <span className='font-mono font-medium'>{item.modifier}</span>
                          </div>
                        )}
                        <div className='mt-3 rounded-md bg-blue-50 p-2'>
                          <div className='flex items-start gap-2'>
                            <InformationCircleIcon className='mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600' />
                            <p className='text-xs text-blue-800'>
                              This data is provided for reference only. Please consult your Medicare Administrative
                              Contractor (MAC) for official payment files.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Pagination Controls */}
      <div className='flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='text-sm text-gray-600'>
          {(() => {
            const start = total === 0 ? 0 : Math.min(total, offset + 1)
            const end = Math.min(total, offset + results.length)
            return `Showing ${start}–${end} of ${total}`
          })()}
        </div>
        <div className='flex flex-col items-stretch gap-2 sm:flex-row sm:items-center'>
          {(() => {
            const currentPage = Math.floor(offset / limit) + 1
            const totalPages = Math.max(1, Math.ceil(total / limit))
            const canUseSelect = totalPages <= 100
            if (canUseSelect) {
              return (
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600'>Page</span>
                  <select
                    className='rounded-md border border-gray-300 bg-white px-2 py-1 text-sm'
                    value={currentPage}
                    onChange={(e) => onPageChange(Number(e.target.value))}
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <span className='text-sm text-gray-600'>of {totalPages}</span>
                </div>
              )
            }
            return (
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600'>Page</span>
                <input
                  type='number'
                  min={1}
                  max={totalPages}
                  defaultValue={currentPage}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = Number((e.target as HTMLInputElement).value)
                      if (!Number.isNaN(value)) onPageChange(Math.min(totalPages, Math.max(1, value)))
                    }
                  }}
                  className='w-20 rounded-md border border-gray-300 px-2 py-1 text-sm'
                />
                <span className='text-sm text-gray-600'>of {totalPages}</span>
              </div>
            )
          })()}
          <div className='flex gap-2'>
            <button
              onClick={onPrev}
              disabled={offset <= 0}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                offset <= 0
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={onNext}
              disabled={offset + limit >= total}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                offset + limit >= total
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-white text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
