'use client'

import type { Product, Category } from '@/types/common'

import React, { useState, useEffect } from 'react'

import { ChevronUpIcon } from '@/assets/icons'
import { ProductsGrid } from '@/components/Pages/Buyer/CategoryDetailPage/components'
import { FilterSidebar } from '@/components/Pages/Buyer/CategoryDetailPage/components/FilterSidebar'
import { useApi } from '@/hooks/useApi'

const PRODUCTS_PER_PAGE = 20

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [hasMoreProducts, setHasMoreProducts] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<any>({})
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Fetch categories for sidebar
  const { getDataSource } = useApi()
  const { data: homeConfig, isLoading: isCategoriesLoading } = getDataSource<{ categories: Category[] }>({
    path: '/v1/home',
  })
  const categories = homeConfig?.categories || []

  // Fetch products
  const { data, isLoading, isFetching, error } = getDataSource<{ data: Product[] }>({
    path: selectedCategory ? `/v1/products/category/${selectedCategory}` : '/v1/products/all',
    query: {
      published: true,
      approved: true,
      page,
      limit: PRODUCTS_PER_PAGE,
      sort: '-createdAt',
      ...selectedFilters,
    },
    enabled: !isCategoriesLoading,
  })

  useEffect(() => {
    if (data?.data) {
      setProducts((prev) => (page === 1 ? data.data : [...prev, ...data.data]))
      setHasMoreProducts(data.data.length === PRODUCTS_PER_PAGE)
    }
  }, [data, page])

  // Reset products when category or filters change
  useEffect(() => {
    setPage(1)
  }, [selectedCategory, selectedFilters])

  const handleLoadMore = () => {
    if (hasMoreProducts && !isFetching) {
      setPage((prev) => prev + 1)
    }
  }

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat.id)
    setPage(1)
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
    setPage(1)
  }

  const clearFilters = () => {
    setSelectedFilters({})
    setPage(1)
  }

  const handleToggleExpand = (catId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }))
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8'>
        <h1 className='mb-8 text-3xl font-bold text-gray-900'>Shop All Products</h1>
        <div className='flex flex-col gap-8 lg:flex-row'>
          {/* Sidebar */}
          <aside className='hidden w-full max-w-xs flex-shrink-0 lg:block'>
            <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <h2 className='mb-4 text-lg font-semibold text-gray-900'>Categories</h2>
              {isCategoriesLoading ? (
                <div className='flex justify-center py-4'>
                  <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary'></div>
                </div>
              ) : (
                <ul className='space-y-2'>
                  <li>
                    <button
                      className={`w-full text-left text-sm font-medium transition-colors ${!selectedCategory ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                      onClick={() =>
                        handleCategorySelect({ id: '', name: '', slug: '', href: '', thumbnailImage: '', count: '' })
                      }
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <div className='flex items-center'>
                        <button
                          className={`flex-1 text-left text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                          onClick={() => handleCategorySelect(cat)}
                        >
                          {cat.name}
                        </button>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <button
                            className='ml-2 p-1 text-gray-400 hover:text-primary'
                            onClick={() => handleToggleExpand(cat.id)}
                            aria-label={expandedCategories[cat.id] ? 'Collapse' : 'Expand'}
                          >
                            <ChevronUpIcon
                              className={`h-4 w-4 transition-transform ${expandedCategories[cat.id] ? 'rotate-180' : ''}`}
                            />
                          </button>
                        )}
                      </div>
                      {cat.subcategories && cat.subcategories.length > 0 && expandedCategories[cat.id] && (
                        <ul className='ml-4 mt-2 space-y-1 border-l border-gray-100 pl-3'>
                          {cat.subcategories.map((sub) => (
                            <li key={sub.id}>
                              <button
                                className={`w-full text-left text-sm font-medium transition-colors ${selectedCategory === sub.id ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
                                onClick={() => handleCategorySelect(sub)}
                              >
                                {sub.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Main Products Section */}
          <main className='flex-1'>
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
                <p className='text-gray-600'>No products found.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ShopPage
