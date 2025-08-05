import type { Category } from '@/types/common'

import React, { useState, useMemo } from 'react'

import Link from 'next/link'

import { ChevronUpIcon } from '@/assets/icons'
import { useApi } from '@/hooks/useApi'

const menuItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'About Us', href: '/about' },
]

export const BuyerNavigation: React.FC = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const { getDataSource } = useApi()

  // Fetch categories from /v1/home (same as BuyerHomePage)
  const { data, isLoading } = getDataSource<{ data: Category[] }>({
    path: '/v1/categories/all/unristricted',
  })

  const categories = data?.data || []

  // Group categories into parents and children
  const grouped = useMemo(() => {
    const parents: Category[] = []
    const childrenMap = new Map<string, Category[]>()

    categories.forEach((c) => {
      if (!c.parentId) parents.push(c)
      else {
        const arr = childrenMap.get(c.parentId) || []
        arr.push(c)
        childrenMap.set(c.parentId, arr)
      }
    })

    // Sort parents and children alphabetically
    parents.sort((a, b) => a.name.localeCompare(b.name))
    childrenMap.forEach((arr) => arr.sort((a, b) => a.name.localeCompare(b.name)))

    return { parents, childrenMap }
  }, [categories])

  const toggleExpand = (parentId: string) => {
    setExpanded((prev) => ({ ...prev, [parentId]: !prev[parentId] }))
  }

  return (
    <nav className='border-b border-gray-200 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-12 items-center justify-between'>
          {/* Categories Dropdown */}
          <div className='relative'>
            <button
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className='flex items-center space-x-1 text-gray-700 transition-colors hover:text-primary'
            >
              <span className='font-medium'>Categories</span>
              <ChevronUpIcon
                className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isCategoriesOpen && (
              <div className='absolute left-0 top-full z-50 mt-1 w-80 rounded-xl border border-gray-200 bg-white shadow-lg'>
                <div className='p-4'>
                  {isLoading ? (
                    <div className='flex justify-center py-4'>
                      <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-primary'></div>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className='px-4 py-2 text-sm text-gray-500'>No categories found.</div>
                  ) : (
                    <div className='space-y-1'>
                      {grouped.parents.map((parent) => {
                        const hasChildren = grouped.childrenMap.has(parent.id)
                        const isOpen = expanded[parent.id]

                        return (
                          <div key={parent.id} className='space-y-1'>
                            <div className='flex items-center'>
                              <Link
                                href={`/category/${parent.slug}`}
                                className='group flex flex-1 items-center px-3 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:text-primary'
                                onClick={() => setIsCategoriesOpen(false)}
                              >
                                <span className='flex-1 text-left'>{parent.name}</span>
                              </Link>
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
                                  {grouped.childrenMap.get(parent.id)!.map((child) => (
                                    <Link
                                      key={child.id}
                                      href={`/category/${child.slug}`}
                                      className='group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:text-primary'
                                      onClick={() => setIsCategoriesOpen(false)}
                                    >
                                      <span className='flex-1 text-left'>{child.name}</span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Menu Items */}
          <div className='hidden items-center space-x-8 md:flex'>
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className='text-sm font-medium text-gray-700 transition-colors hover:text-primary'
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Promotional */}
          <div className='flex items-center space-x-4'>
            <span className='text-sm font-medium text-secondary'>Fast & Reliable Shipping</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
