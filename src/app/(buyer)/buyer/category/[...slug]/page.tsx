import React from 'react'

import { CategoryDetailPage } from '@/components/Pages/Buyer/CategoryDetailPage'

import { fetchCategoryDetailBySlug } from './utils'

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const slugArray = (await params).slug
  const slug = slugArray.join('/')

  try {
    const categoryRes = await fetchCategoryDetailBySlug(slug)

    if (!categoryRes) {
      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <h1 className='mb-4 text-2xl font-bold text-gray-900'>Category Not Found</h1>
            <p className='text-gray-600'>The category you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      )
    }

    return (
      <CategoryDetailPage
        categoryName={categoryRes.name}
        categoryImage={categoryRes.thumbnailImage.url || '/images/cards/cards-01.png'}
        productCount={categoryRes.count || '0+ products'}
        categoryId={categoryRes.id}
      />
    )
  } catch (error) {
    console.error('Error fetching category:', error)
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Something went wrong</h1>
          <p className='text-gray-600'>Unable to load the category. Please try again later.</p>
        </div>
      </div>
    )
  }
}
