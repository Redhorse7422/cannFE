import type { AppliedFilters } from '@/types/common'

import React from 'react'

interface FilterSidebarProps {
  selectedFilters: AppliedFilters
  onFilterChange: (filterType: string, value: string) => void
  onClearFilters: () => void
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
      </div>
    </div>
  )
}
