'use client'

import type { Product, Category } from '@/types/common'

import React, { useState, useEffect } from 'react'

import { ChevronUpIcon } from '@/assets/icons'
import { ProductsGrid } from '@/components/Pages/Buyer/CategoryDetailPage/components'
import { useApi } from '@/hooks/useApi'

const PRODUCTS_PER_PAGE = 20

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [hasMoreProducts, setHasMoreProducts] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const { getDataSource } = useApi()

  const { data: catResp, isLoading: isCatLoading } = getDataSource<Category[]>({
    path: '/v1/categories/all/unrestricted',
  })
  const cats = catResp || []

  const {
    data: prodResp,
    isLoading,
    isFetching,
  } = getDataSource<{
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

  useEffect(() => {
    if (prodResp?.data) {
      const list = prodResp.data
      setProducts(page === 1 ? list : [...products, ...list])
      setHasMoreProducts(list.length === PRODUCTS_PER_PAGE)
    }
    // eslint-disable-next-line
  }, [prodResp, page])

  useEffect(() => setPage(1), [selectedCategory])

  const handleSelect = (id: string | null) => {
    setSelectedCategory(id)
    setPage(1)
  }

  const toggleExpand = (parentId: string) =>
    setExpanded((prev) => {
      const isCurrentlyOpen = prev[parentId]
      return isCurrentlyOpen ? {} : { [parentId]: true }
    })

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8'>
        <h1 className='mb-8 text-3xl font-bold'>Shop All Products</h1>
        <div className='flex flex-col gap-8 lg:flex-row'>
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
          <main className='flex-1'>
            {isLoading && page === 1 ? (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className='animate-pulse'>
                    <div className='mb-4 h-64 rounded-lg bg-gray-200' />
                    <div className='mb-2 h-4 rounded bg-gray-200' />
                    <div className='h-4 w-3/4 rounded bg-gray-200' />
                  </div>
                ))}
              </div>
            ) : (
              <ProductsGrid
                products={products}
                hasMoreProducts={hasMoreProducts}
                onLoadMore={() => setPage((p) => p + 1)}
              />
            )}
            {isFetching && page > 1 && (
              <div className='flex justify-center py-4'>
                <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary' />
              </div>
            )}
            {!isLoading && products.length === 0 && (
              <div className='py-8 text-center text-gray-600'>No products found.</div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ShopPage
