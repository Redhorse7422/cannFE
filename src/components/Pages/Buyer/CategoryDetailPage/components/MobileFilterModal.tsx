import type { AppliedFilters } from '@/types/common'

import React from 'react'

interface MobileFilterModalProps {
  isOpen: boolean
  onClose: () => void
  selectedFilters: AppliedFilters
  onFilterChange: (filterType: string, value: string) => void
  onClearFilters: () => void
}

const filterOptions = {
  price: [
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100+', label: 'Over $100' },
  ],
  rating: [
    { value: '4+', label: '4+ Stars' },
    { value: '3+', label: '3+ Stars' },
    { value: '2+', label: '2+ Stars' },
  ],
  availability: [
    { value: 'in-stock', label: 'In Stock' },
    { value: 'on-sale', label: 'On Sale' },
  ],
}

export const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 lg:hidden'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black bg-opacity-50' onClick={onClose} />

      {/* Modal */}
      <div className='absolute right-0 top-0 h-full w-80 bg-white shadow-xl'>
        <div className='flex h-full flex-col'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-gray-200 p-4'>
            <h2 className='text-lg font-semibold text-gray-900'>Filters</h2>
            <button onClick={onClose} className='text-gray-600 hover:text-gray-400'>
              <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto p-4'>
            <div className='mb-6 flex items-center justify-between'>
              <span className='text-sm text-gray-600'>Active filters</span>
              <button onClick={onClearFilters} className='text-sm text-primary/80 hover:text-primary'>
                Clear all
              </button>
            </div>

            {/* Price Filter */}
            <div className='mb-6'>
              <h3 className='mb-3 font-medium text-gray-900'>Price Range</h3>
              <div className='space-y-2'>
                {filterOptions.price.map((option) => (
                  <label key={option.value} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedFilters.price !== undefined}
                      onChange={() => onFilterChange('price', option.value)}
                      className='rounded border-gray-300 text-primary focus:ring-primary'
                    />
                    <span className='ml-2 text-sm text-gray-700'>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className='mb-6'>
              <h3 className='mb-3 font-medium text-gray-900'>Customer Rating</h3>
              <div className='space-y-2'>
                {filterOptions.rating.map((option) => (
                  <label key={option.value} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedFilters.rating !== undefined}
                      onChange={() => onFilterChange('rating', option.value)}
                      className='rounded border-gray-300 text-primary focus:ring-primary'
                    />
                    <span className='ml-2 text-sm text-gray-700'>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className='mb-6'>
              <h3 className='mb-3 font-medium text-gray-900'>Availability</h3>
              <div className='space-y-2'>
                {filterOptions.availability.map((option) => (
                  <label key={option.value} className='flex items-center'>
                    <input
                      type='checkbox'
                      checked={selectedFilters.availability === option.value}
                      onChange={() => onFilterChange('availability', option.value)}
                      className='rounded border-gray-300 text-primary focus:ring-primary'
                    />
                    <span className='ml-2 text-sm text-gray-700'>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className='border-t border-gray-200 p-4'>
            <button
              onClick={onClose}
              className='w-full rounded-lg bg-primary py-3 font-semibold text-white transition-colors hover:bg-primary/90'
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
