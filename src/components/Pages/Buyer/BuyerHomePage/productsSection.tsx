import type { Product } from '@/types/common'

import Link from 'next/link'

import { ArrowRightIcon } from '@/assets/icons'
import { ProductCard } from '@/components/common/products/ProductCard'

interface CartItemsProps {
  products: Product[]
  sectionTitle: string
  isLoading?: boolean
}

export const ProductsSection: React.FC<CartItemsProps> = ({ products, sectionTitle, isLoading }) => {
  return isLoading ? (
    <div className='grid grid-cols-1 gap-6 py-16 md:grid-cols-2 lg:grid-cols-4'>
      {[...Array(4)].map((_, index) => (
        <div key={index} className='animate-pulse'>
          <div className='mb-4 h-64 rounded-lg bg-gray-200'></div>
          <div className='mb-2 h-4 rounded bg-gray-200'></div>
          <div className='h-4 w-3/4 rounded bg-gray-200'></div>
        </div>
      ))}
    </div>
  ) : (
    <section className='py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 flex items-center justify-between'>
          <div>
            <h2 className='mb-2 text-3xl font-bold text-gray-900'>{sectionTitle}</h2>
            {/* Optionally add a description here */}
          </div>
          <Link href='/products' className='flex items-center font-semibold text-primary hover:text-primary/80'>
            View All
            <ArrowRightIcon className='ml-1 h-4 w-4' />
          </Link>
        </div>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {Array.isArray(products) && products.length === 0 && (
          <div className='py-8 text-center'>
            <p className='text-gray-600'>No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
