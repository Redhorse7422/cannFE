'use client'

import type { Product, Category } from '@/types/common'
import React, { useState, useEffect } from 'react'
import { ChevronUpIcon } from '@/assets/icons'
import { ProductsGrid } from '@/components/Pages/Buyer/CategoryDetailPage/components'
import { FilterSidebar } from '@/components/Pages/Buyer/CategoryDetailPage/components'
import { useApi } from '@/hooks/useApi'

const PRODUCTS_PER_PAGE = 20

const ShopPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<Product[]>([])
  const [hasMoreProducts, setHasMoreProducts] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<any>({})
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const { getDataSource } = useApi()

  const { data: catResp, isLoading: isCatLoading } = getDataSource<{
    data: Category[]
  }>({
    path: '/v1/categories/all/unristricted',
    query: { page: 1 },
  })
  const cats = catResp?.data || []

  const { data: prodResp, isLoading, isFetching } = getDataSource<{
    data: Product[]
  }>({
    path: selectedCategory ? `/v1/products/category/${selectedCategory}` : '/v1/products/all',
    query: {
      published: true,
      approved: true,
      page,
      limit: PRODUCTS_PER_PAGE,
      sort: '-createdAt',
      ...selectedFilters,
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

  useEffect(() => setPage(1), [selectedCategory, selectedFilters])

  const handleSelect = (id: string | null) => {
    setSelectedCategory(id)
    setPage(1)
  }

  const toggleExpand = (parentId: string) =>
    setExpanded((prev) => ({ ...prev, [parentId]: !prev[parentId] }))

  const grouped = React.useMemo(() => {
    const parents: Category[] = []
    const childrenMap = new Map<string, Category[]>()

    cats.forEach((c) => {
      if (!c.parentId) parents.push(c)
      else {
        const arr = childrenMap.get(c.parentId) || []
        arr.push(c)
        childrenMap.set(c.parentId, arr)
      }
    })

    // Sort parents and children alphabetically
    parents.sort((a, b) => a.name.localeCompare(b.name))
    childrenMap.forEach((arr) =>
      arr.sort((a, b) => a.name.localeCompare(b.name))
    )

    return { parents, childrenMap }
  }, [cats])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-8xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Shop All Products</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-full max-w-xs">
            <div className="rounded-lg bg-white border p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Categories</h2>
              {isCatLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
                </div>
              ) : (
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left text-sm font-medium ${!selectedCategory ? 'text-primary' : 'hover:text-primary'}`}
                      onClick={() => handleSelect(null)}
                    >
                      All Products
                    </button>
                  </li>
                  {grouped.parents.map((parent) => {
                    const hasChildren = grouped.childrenMap.has(parent.id)
                    const isOpen = expanded[parent.id]
                    return (
                      <li key={parent.id}>
                        <div className="flex items-center">
                          <button
                            className={`flex-1 text-left text-sm font-medium ${selectedCategory === parent.id ? 'text-primary' : 'hover:text-primary'}`}
                            onClick={() => handleSelect(parent.id)}
                          >
                            {parent.name}
                          </button>
                          {hasChildren && (
                            <button
                              className="ml-2 p-1 text-gray-500 hover:text-primary"
                              onClick={() => toggleExpand(parent.id)}
                              aria-label={isOpen ? 'Collapse' : 'Expand'}
                            >
                              <ChevronUpIcon
                                className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                              />
                            </button>
                          )}
                        </div>
                        {isOpen && hasChildren && (
                          <ul className="ml-4 mt-2 space-y-1 pl-3 border-l border-gray-100">
                            {grouped.childrenMap.get(parent.id)!.map((child) => (
                              <li key={child.id}>
                                <button
                                  className={`w-full text-left text-sm font-medium ${selectedCategory === child.id ? 'text-primary' : 'hover:text-primary'}`}
                                  onClick={() => handleSelect(child.id)}
                                >
                                  {child.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={(type, val) => {
                const curr = selectedFilters[type] || []
                const updated = curr.includes(val) ? curr.filter((v: any) => v !== val) : [...curr, val]
                setSelectedFilters({ ...selectedFilters, [type]: updated.length ? updated : [] })
                setPage(1)
              }}
              onClearFilters={() => {
                setSelectedFilters({})
                setPage(1)
              }}
            />
          </aside>
          <main className="flex-1">
            {isLoading && page === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, idx) => (
                  <div key={idx} className="animate-pulse">
                    <div className="mb-4 h-64 rounded-lg bg-gray-200" />
                    <div className="mb-2 h-4 rounded bg-gray-200" />
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductsGrid products={products} hasMoreProducts={hasMoreProducts} onLoadMore={() => setPage((p) => p + 1)} />
            )}
            {isFetching && page > 1 && (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
              </div>
            )}
            {!isLoading && products.length === 0 && (
              <div className="py-8 text-center text-gray-600">No products found.</div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ShopPage
