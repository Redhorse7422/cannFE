'use client'

import type { Product } from '@/types/common'
// import type { Product, AppliedFilters } from '@/types/common'

import React, { useState, useEffect } from 'react'

import { useApi } from '@/hooks/useApi'

import { CategoryHeader, FilterSidebar, ProductsToolbar, ProductsGrid, MobileFilterModal } from './components'

interface CategoryDetailPageProps {
  categoryName: string
  categoryImage: string
  productCount: string
  categoryId?: string
}

const PRODUCTS_PER_PAGE = 20

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categoryName,
  categoryImage,
  productCount,
  categoryId,
}) => {
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({})
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [hasMoreProducts, setHasMoreProducts] = useState(true)

  const { getDataSource } = useApi()
  const { data, isLoading, error, isFetching } = getDataSource<{ data: any[] }>({
    path: `/v1/products/category/${categoryId}`,
    query: {
      published: true,
      approved: true,
      page,
      limit: PRODUCTS_PER_PAGE,
      sort: '-createdAt',
    },
    enabled: !!categoryId,
  })

  // Append new products when data changes
  useEffect(() => {
    if (data?.data) {
      setProducts((prev) => (page === 1 ? data.data : [...prev, ...data.data]))
      setHasMoreProducts(data.data.length === PRODUCTS_PER_PAGE)
    }
  }, [data, page])

  const handleLoadMore = () => {
    if (hasMoreProducts && !isFetching) {
      setPage((prev) => prev + 1)
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters((prev: any) => {
      const current = prev[filterType] || []
      const updated = current.includes(value) ? current.filter((v: any) => v !== value) : [...current, value]
      return {
        ...prev,
        [filterType]: updated.length > 0 ? updated : [],
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({})
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const activeFiltersCount = Object.values(selectedFilters).flat().length

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>Something went wrong</h2>
          <button onClick={() => setPage(1)} className='rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90'>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <CategoryHeader
        categoryName={categoryName}
        categoryImage={categoryImage}
        productCount={Number(productCount) || products.length}
      />

      <div className='mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Filters Sidebar - Desktop */}
          <div className='hidden lg:block'>
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Products Section */}
          <div className='flex-1'>
            {/* Toolbar */}
            <ProductsToolbar
              sortBy={sortBy}
              onSortChange={setSortBy}
              onToggleFilters={toggleFilters}
              showFilters={showFilters}
              activeFiltersCount={activeFiltersCount}
              productCount={products.length}
            />

            {/* Products Grid */}
            {isLoading && page === 1 ? (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                {[...Array(8)].map((_, index) => (
                  <div key={index} className='animate-pulse'>
                    <div className='mb-4 h-64 rounded-lg bg-gray-200'></div>
                    <div className='mb-2 h-4 rounded bg-gray-200'></div>
                    <div className='h-4 w-3/4 rounded bg-gray-200'></div>
                  </div>
                ))}
              </div>
            ) : (
              <ProductsGrid products={products} onLoadMore={handleLoadMore} hasMoreProducts={hasMoreProducts} />
            )}
            {isFetching && page > 1 && (
              <div className='flex justify-center py-4'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
              </div>
            )}
            {!isLoading && products.length === 0 && (
              <div className='py-8 text-center'>
                <p className='text-gray-600'>No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
    </div>
  )
}
