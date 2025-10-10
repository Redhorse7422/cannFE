'use client'
import type { CategoryType, ProductDetail } from '@/types/product'
import type { Seller } from '@/types/seller'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { ArrowLeftIcon } from '@/assets/icons'
import { ContactPopup } from '@/components/Auth/ContactPopup'
import RichTextViewer from '@/components/common/RichTextViewer'
import { useApi } from '@/hooks/useApi'
import { ConvertSlugToTitle } from '@/utils/slug-to-title'

// export default async function VendorDetailPage({ params }: { params: Promise<{ slug: string; vendorId: string }> }) {
export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()

  const { slug, vendorId } = params
  // const vendor = vendorData[parseInt(vendorId) as keyof typeof vendorData]

  const { data: session } = useSession()

  const { getDataSource, getDataSourceById } = useApi()
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)

  const {
    data: vendor,
    isLoading,
    error,
    isFetching,
  } = getDataSourceById<Seller>({
    path: '/v1/sellers',
    id: vendorId as string,
    enabled: !!vendorId,
    query: {
      id: vendorId,
    },
  })

  const {
    data: productResp,
    isLoading: productsLoading,
    error: productsError,
    isFetching: productsFetching,
  } = getDataSource<{ data: ProductDetail[] }>({
    path: `/v1/products/seller/${vendorId}`,
    enabled: !!vendorId && !!session?.user,
  })
  const products = productResp?.data || []

  if (isLoading || isFetching) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>Loading service details...</p>
        </div>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Vendor Not Found</h1>
          <p className='mb-6 text-gray-600'>The vendor you are looking for doesnt exist.</p>
          <Link href='/services' className='text-blue-600 hover:text-blue-800'>
            Return to Service
          </Link>
        </div>
      </div>
    )
  }
  const businessLogoImage = vendor?.businessLogoImage as any
  const profileImage = businessLogoImage?.url ?? '/images/user/user-01.png'
  const website = vendor.businessWebsite?.trim()
  const websiteUrl = website && !website.startsWith('http') ? `https://${website}` : website
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 py-6'>
          <div className='flex items-center gap-4'>
            <Link
              href={`/services/${slug}`}
              className='flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-800'
            >
              <ArrowLeftIcon className='h-5 w-5' />
              Back to {ConvertSlugToTitle(slug as string)}
            </Link>
          </div>
        </div>
      </div>

      {/* Vendor Header */}
      <section className='bg-gradient-to-r from-blue-700 to-blue-400 py-16 text-white'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-6 flex items-center gap-6'>
            <div className='flex h-60 w-60 items-center justify-center overflow-hidden'>
              <Image
                src={profileImage}
                width={120}
                height={120}
                alt={vendor.businessName ?? 'vendor info'}
                className='object-cover'
              />
            </div>
            <div className='mb-6'>
              <h1 className='mb-2 text-4xl font-bold'>{vendor.businessName}</h1>
              <p className='text-lg text-white'>{vendor.businessDescription}</p>
              <div className='flex items-center gap-6'>
                <div className='text-white'>
                  <span className='font-bold'>Contact:</span> {vendor.businessPhone}
                </div>
                <div className='text-white'>
                  <span className='font-bold'>Website:</span>{' '}
                  {websiteUrl ? (
                    <a
                      target='_blank'
                      rel='noopener noreferrer'
                      href={websiteUrl}
                      className='text-white underline hover:text-blue-300'
                    >
                      {vendor.businessWebsite}
                    </a>
                  ) : (
                    <span className='text-gray-400'>N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <section className='bg-gradient-to-r from-blue-700 to-blue-400 py-16 text-white'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-6'>
            <h1 className='mb-2 text-4xl font-bold'>{vendor.businessName}</h1>
            <p className='text-xl text-blue-100'>{vendor.businessName}</p>
          </div>
          <div className='flex items-center gap-6'>
            <div className='text-blue-200'>
              <span className='font-medium'>Contact:</span> {vendor.businessPhone}
            </div>
            <div className='text-blue-200'>
              <span className='font-medium'>Website:</span> {vendor.businessWebsite}
            </div>
          </div>
        </div>
      </section> */}

      <section className='py-16 pb-0'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='rounded-lg bg-white p-8 pb-10 shadow-lg'>
            <h2 className='mb-6 text-2xl font-bold text-gray-900'>Vendor Details</h2>
            <RichTextViewer html={vendor.longDescription || ''} className='prose max-w-none text-gray-800' />
            {!vendor.longDescription && vendor.businessDescription && (
              <div className='mb-6'>
                <h3 className='mb-2 text-lg font-semibold text-gray-800'>Description</h3>
                <p className='text-gray-600'>{vendor.businessDescription}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Section */}

      {!session?.user ? (
        <div className='mx-auto max-w-7xl px-4 py-6'>
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-6 text-center text-blue-800'>
            Please <span className='font-semibold'>Sign In</span> to view products for this vendor.
          </div>
        </div>
      ) : productsLoading || productsFetching ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='mb-4 h-6 w-2/3 rounded bg-gray-200'></div>
              <div className='mb-2 h-4 w-1/2 rounded bg-gray-200'></div>
              <div className='h-4 w-1/3 rounded bg-gray-200'></div>
            </div>
          ))}
        </div>
      ) : productsError ? (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-red-700'>
          Failed to load products. Please try again.
        </div>
      ) : products.length === 0 ? (
        <div className='rounded-lg border border-gray-200 bg-white p-6 text-gray-600'>
          No Products found for this vendor yet.
        </div>
      ) : (
        <section className='py-16'>
          <div className='mx-auto max-w-7xl px-4'>
            <h2 className='mb-12 text-center text-3xl font-bold text-gray-900'>Available Products & Services</h2>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {products.map((product) => (
                <div key={product.id} className='rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl'>
                  <div className='mb-4 flex items-start gap-2 whitespace-nowrap'>
                    {product.categories?.map((item: CategoryType, index: number) => (
                      <div key={index}>
                        <span className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h3 className='mb-3 text-xl font-bold text-gray-900'>{product.name}</h3>
                  <p className='mb-6 text-gray-600'>{product.shortDescription}</p>

                  <div className='mb-6 flex justify-between'>
                    <div>
                      <h4 className='mb-3 font-semibold text-gray-900'>Features:</h4>
                      <div className='flex flex-wrap gap-2'>
                        {product.tags.map((feature, index) => (
                          <span
                            key={index}
                            className='rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700'
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    {product.canBePurchased && (
                      <div className='text-right'>
                        {Number(product.salePrice) > 0 ? (
                          <div>
                            <div className='text-2xl font-bold text-green-600'>${product.salePrice}</div>
                            <div className='text-lg text-gray-500 line-through'>${product.regularPrice}</div>
                          </div>
                        ) : (
                          <div className='text-2xl font-bold text-green-600'>${product.regularPrice}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className='flex items-center justify-between'>
                    <button
                      onClick={() => {
                        router.push(` /services/${slug}/vendors/${vendorId}/${product.slug}`)
                      }}
                      className='rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700'
                    >
                      {product.canBePurchased ? 'Add To Cart' : 'Learn More'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* CTA Section */}
      <section className='bg-blue-900 py-16 text-white'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Ready to Work with {vendor.businessName}?</h2>
          <p className='mb-8 text-xl text-blue-200'>
            Contact us to get started with {vendor.businessName} and transform your practice today.
          </p>
          <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
            <button
              onClick={() => setIsContactPopupOpen(true)}
              className='rounded-lg bg-green-400 px-8 py-3 font-semibold text-blue-900 transition-colors hover:bg-green-500'
            >
              Contact Us
            </button>
            <button
              onClick={() => setIsContactPopupOpen(true)}
              className='rounded-lg border border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-blue-900'
            >
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>
      <ContactPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />
    </div>
  )
}
