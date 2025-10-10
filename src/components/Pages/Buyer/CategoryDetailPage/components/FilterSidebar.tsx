import type { AppliedFilters } from '@/types/common'

import React from 'react'

interface FilterSidebarProps {
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

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ selectedFilters, onFilterChange, onClearFilters }) => {
  const activeFiltersCount = Object.keys(selectedFilters).length

  return (
    <div className='flex-shrink-0 lg:w-64'>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='mb-6 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-gray-900'>Filters</h2>
          {activeFiltersCount > 0 && (
            <button onClick={onClearFilters} className='text-sm text-primary/80 hover:text-primary'>
              Clear all
            </button>
          )}
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
    </div>
  )
}
