'use client'

import type { Category, Product } from '@/types/common'

import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon } from '@/assets/icons'
import { CategorySlider } from '@/components/common/products/CategorySlider'
import { useApi } from '@/hooks/useApi'

import { ProductsSection } from './productsSection'

export interface HomeConfig {
  featured: Product[]
  new: Product[]
  variant: Product[]
  categories: Category[]
}

// Custom hook for fetching featured products
const useHomeConfig = () => {
  const { getDataSource } = useApi()
  return getDataSource<HomeConfig>({
    path: '/v1/home',
  })
}

export const BuyerHomePage: React.FC = () => {
  // Fetch data
  const { data: homeConfig, isLoading: configLoad, error: configError } = useHomeConfig()

  if (configError) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>Something went wrong</h2>
          <p className='mb-4 text-gray-600'>Unable to load the home page content.</p>
          <button
            onClick={() => window.location.reload()}
            className='rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90'
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative min-h-100 py-20 text-white'>
        {/* Background Image */}
        <div className='absolute inset-0 z-0'>
          <Image src='/images/Banner_01.jpg' alt='Hero Background' fill className='object-cover' priority />
          {/* Overlay for better text readability */}
          {/* <div className='absolute inset-0 bg-black/40'></div> */}
        </div>

        {/* <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-2'>
            <div>
              <h1 className='mb-6 text-4xl font-bold md:text-5xl lg:text-6xl'>
                Discover Amazing
                <span className='block text-secondary'>Products</span>
              </h1>
              <p className='mb-8 text-xl text-white/90'>
                Shop the latest trends and find your perfect style. Quality products at unbeatable prices.
              </p>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <Link
                  href='/shop'
                  className='inline-flex items-center justify-center rounded-lg bg-secondary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-secondary/90'
                >
                  Shop Now
                  <ArrowRightIcon className='ml-2 h-5 w-5' />
                </Link>
               
              </div>
            </div>
          </div>
        </div> */}
      </section>

      {/* Categories Section */}
      <section className='bg-gray-50 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900'>Shop by Category</h2>
            <p className='text-lg text-gray-600'>Find what you&apos;re looking for in our curated categories</p>
          </div>
          {homeConfig?.categories.length === 0 ? (
            <div className='flex justify-center py-8'>
              <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-primary'></div>
            </div>
          ) : (
            <CategorySlider categories={homeConfig?.categories || []} />
          )}
        </div>
      </section>

      {/* Dynamic Product Sections */}
      <ProductsSection products={homeConfig?.featured ?? []} sectionTitle='Featured Products' isLoading={configLoad} />

      <ProductsSection products={homeConfig?.new ?? []} sectionTitle='New Products' isLoading={configLoad} />

      {/* Promotional Banner */}
      <section className='bg-secondary py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='text-center text-white'>
            <h2 className='mb-4 text-3xl font-bold md:text-4xl'>Limited Time Offer</h2>
            <p className='mb-8 text-xl text-white/90'>
              Get up to 50% off on selected items. Don&apos;t miss out on these amazing deals!
            </p>
            <Link
              href='/deals'
              className='inline-flex items-center rounded-lg bg-white px-8 py-3 text-lg font-semibold text-secondary transition-colors hover:bg-gray-100'
            >
              Shop Deals
              <ArrowRightIcon className='ml-2 h-5 w-5' />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='bg-gray-900 py-16 text-white'>
        <div className='mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
          <h2 className='mb-4 text-3xl font-bold'>Stay in the Loop</h2>
          <p className='mb-8 text-xl text-gray-300'>
            Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special
            offers.
          </p>
          <div className='mx-auto flex max-w-md flex-col gap-4 sm:flex-row'>
            <input
              type='email'
              placeholder='Enter your email address'
              className='flex-1 rounded-lg border-0 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary'
            />
            <button className='rounded-lg bg-primary px-8 py-3 font-semibold transition-colors hover:bg-primary/90'>
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
