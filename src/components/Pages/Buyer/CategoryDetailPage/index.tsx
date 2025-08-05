'use client'

import type { Product, Category } from '@/types/common'

// import type { Product, AppliedFilters } from '@/types/common'

import React, { useState, useEffect } from 'react'

import { ChevronUpIcon } from '@/assets/icons'
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId!)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const { getDataSource } = useApi()

  const { data: catResp, isLoading: isCatLoading } = getDataSource<Category[]>({
    path: '/v1/categories/all/unrestricted',
  })
  const cats = catResp || []

  // const { data, isLoading, error, isFetching } = getDataSource<{ data: any[] }>({
  //   path: `/v1/products/category/${categoryId}`,
  //   query: {
  //     published: true,
  //     approved: true,
  //     page,
  //     limit: PRODUCTS_PER_PAGE,
  //     sort: '-createdAt',
  //   },
  //   enabled: !!categoryId,
  // })

  const { data, isLoading, error, isFetching } = getDataSource<{
    data: Product[]
  }>({
    path: selectedCategory ? `/v1/products/category/${selectedCategory}` : '/v1/products/all',
    query: {
      published: true,
      approved: true,
      page,
      limit: PRODUCTS_PER_PAGE,
      sort: '-createdAt',
    },
    enabled: !isCatLoading,
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

  useEffect(() => setPage(1), [selectedCategory])

  const handleSelect = (id: string | null) => {
    setSelectedCategory(id ?? null)
    setPage(1)
  }

  const toggleExpand = (parentId: string) =>
    setExpanded((prev) => {
      const isCurrentlyOpen = prev[parentId]
      return isCurrentlyOpen ? {} : { [parentId]: true }
    })

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
          <aside className='hidden w-full lg:block' style={{ maxWidth: 280 }}>
            <div className='mb-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-6 text-lg font-semibold text-gray-900'>Categories</h2>
              {isCatLoading ? (
                <div className='flex justify-center py-4'>
                  <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary' />
                </div>
              ) : (
                <div className='space-y-1'>
                  <button
                    className={`group flex w-full items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      !selectedCategory
                        ? 'border-l-2 border-primary bg-primary/5 text-primary'
                        : 'text-gray-700 hover:text-primary'
                    }`}
                    onClick={() => handleSelect(null)}
                  >
                    <span className='flex-1 text-left'>All Products</span>
                    {!selectedCategory && <div className='ml-2 h-2 w-2 rounded-full bg-primary'></div>}
                  </button>

                  {cats.map((parent) => {
                    const hasChildren = parent?.children!.length > 0 ? true : false
                    const isOpen = expanded[parent.id]
                    const isSelected = selectedCategory === parent.id

                    return (
                      <div key={parent.id} className='space-y-1'>
                        <div className='flex items-center'>
                          <button
                            className={`group flex flex-1 items-center px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? 'border-l-2 border-primary bg-primary/5 text-primary'
                                : 'text-gray-700 hover:text-primary'
                            }`}
                            onClick={() => handleSelect(parent.id)}
                          >
                            <span className='flex-1 text-left'>{parent.name}</span>
                            {isSelected && <div className='ml-2 h-2 w-2 rounded-full bg-primary'></div>}
                          </button>
                          {hasChildren && (
                            <button
                              className='ml-2 flex h-8 w-8 items-center justify-center text-gray-400 transition-all duration-200 hover:text-primary'
                              onClick={() => toggleExpand(parent.id)}
                              aria-label={isOpen ? 'Collapse' : 'Expand'}
                            >
                              <ChevronUpIcon
                                className={`h-4 w-4 transform transition-transform duration-200 ${
                                  isOpen ? 'rotate-180' : 'rotate-0'
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {hasChildren && (
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className='ml-4 space-y-1 border-l-2 border-gray-200 pl-4'>
                              {parent.children?.map((child) => {
                                const isChildSelected = selectedCategory === child.id
                                return (
                                  <button
                                    key={child.id}
                                    className={`group flex w-full items-center px-3 py-2 text-sm font-medium transition-all duration-200 ${
                                      isChildSelected
                                        ? 'border-l-2 border-primary bg-primary/5 text-primary'
                                        : 'text-gray-600 hover:text-primary'
                                    }`}
                                    onClick={() => handleSelect(child.id)}
                                  >
                                    <span className='flex-1 text-left'>{child.name}</span>
                                    {isChildSelected && <div className='ml-2 h-2 w-2 rounded-full bg-primary'></div>}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </aside>

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
