'use client'

import type { Category } from '@/types/common'
import type { Seller } from '@/types/seller'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { ArrowLeftIcon, ArrowRightIcon } from '@/assets/icons'
import { ContactPopup } from '@/components/Auth/ContactPopup'
import { LoginPopup } from '@/components/Auth/LoginPopup'
import { Flex } from '@/components/common/Flex'
import RichTextViewer from '@/components/common/RichTextViewer'
import { Icon } from '@/components/common/icon'
import { useApi } from '@/hooks/useApi'

export default function ServiceDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)

  const { getDataSource } = useApi()
  const { data, isLoading, error, isFetching } = getDataSource<Category>({
    path: `/v1/categories/slug/${slug}`,
  })

  // Fetch vendors/sellers for this service (category) – must be called unconditionally before any return
  const categoryId = data?.id
  const {
    data: sellersResp,
    isLoading: sellersLoading,
    error: sellersError,
    isFetching: sellersFetching,
  } = getDataSource<{ data: Seller[] }>({
    path: `/v1/categories/${categoryId}/sellers`,
    enabled: !!categoryId,
  })
  const sellers = sellersResp?.data || []

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

  if (error || !data) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>Service Not Found</h1>
          <p className='mb-6 text-gray-600'>The service you are looking for does not exist.</p>
          <Link href='/' className='text-blue-600 hover:text-blue-800'>
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const service = data

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 py-6'>
          <div className='flex items-center gap-4'>
            <Link href='/' className='flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-800'>
              <ArrowLeftIcon className='h-5 w-5' />
              Back to Services
            </Link>
          </div>
        </div>
      </div>

      {/* Service Header */}
      <section className='bg-gradient-to-r from-blue-700 to-blue-400 py-16 text-white'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='mb-6 flex items-center gap-6'>
            <div className='text-6xl'>🩺</div>
            <div>
              <h1 className='mb-2 text-4xl font-bold'>{service.name}</h1>
              <p className='text-xl text-blue-100'>{service.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className='py-16 pb-0'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='rounded-lg bg-white p-8 shadow-lg'>
            <div className='flex items-center justify-between'>
              <h2 className='text-2xl font-bold text-gray-900'>Service Information</h2>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className='font-medium text-blue-600 hover:text-blue-800'
              >
                {isCollapsed ? <Icon name='AiOutlineDown' /> : <Icon name='AiOutlineUp' />}
              </button>
            </div>

            {!isCollapsed && (
              <div className='mt-6'>
                <RichTextViewer html={service.longDescription || ''} className='prose max-w-none text-gray-800' />
                {!service.longDescription && service.description && (
                  <div className='mb-6'>
                    <h3 className='mb-2 text-lg font-semibold text-gray-800'>Description</h3>
                    <p className='text-gray-600'>{service.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className={service.children?.length ? 'py-16' : ''}>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {isLoading
              ? // Skeleton placeholder
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className='flex animate-pulse flex-col items-center rounded-2xl bg-blue-50 p-8 text-center shadow'
                  >
                    <div className='mb-4 h-16 w-16 rounded-full bg-blue-200'></div>
                    <div className='mb-2 h-4 w-32 rounded bg-blue-200'></div>
                    <div className='h-3 w-48 rounded bg-blue-100'></div>
                  </div>
                ))
              : Array.isArray(service.children) &&
                service.children.map((serviceCH: Category) => (
                  <Link
                    key={serviceCH.slug}
                    href={`/services/${serviceCH.slug}`}
                    className='group cursor-pointer rounded-2xl bg-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl'
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <Image src={serviceCH.thumbnailImage.url} alt={serviceCH.name} width={80} height={80} />
                    </div>

                    <h3 className='mb-3 text-2xl font-bold text-gray-900'>{serviceCH.name}</h3>
                    <p className='mb-4 text-gray-600'>{serviceCH.description}</p>

                    <div className='flex items-center justify-between'>
                      View Details
                      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200'>
                        <ArrowRightIcon className='h-4 w-4 text-blue-600' />
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* Vendors Offering This Service (authenticated users only) */}
      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <h2 className='mb-6 text-2xl font-bold text-gray-900'>Vendors for {service.name}</h2>
          {/* {!session?.user ? (
            <div className='flex rounded-lg border border-blue-200 bg-blue-50 p-6 text-blue-800'>
              Please sign in to view vendors for this service.
              <button
                onClick={() => setIsLoginPopupOpen(true)}
                className='flex items-center space-x-2 px-2 text-gray-600 transition-colors hover:text-primary'
              >
                <Icon name='AiOutlineUser' size='2xl' />
                <span className='hidden md:block'>Sign In</span>
              </button>
            </div>
          ) : */}
          {sellersLoading || sellersFetching ? (
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                  <div className='mb-4 h-6 w-2/3 rounded bg-gray-200'></div>
                  <div className='mb-2 h-4 w-1/2 rounded bg-gray-200'></div>
                  <div className='h-4 w-1/3 rounded bg-gray-200'></div>
                </div>
              ))}
            </div>
          ) : sellersError ? (
            <div className='rounded-lg border border-red-200 bg-red-50 p-4 text-red-700'>
              Failed to load vendors. Please try again.
            </div>
          ) : sellers.length === 0 ? (
            <div className='rounded-lg border border-gray-200 bg-white p-6 text-gray-600'>
              No vendors found for this service yet.
            </div>
          ) : (
            // <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            //   {sellers.map((seller) => (
            //     <div key={seller.id} className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            //       <div className='mb-2 text-lg font-semibold text-gray-900'>
            //         {seller.businessName || seller.user?.firstName || 'Vendor'}
            //       </div>
            //       {seller.businessDescription && (
            //         <p className='mb-3 line-clamp-3 text-sm text-gray-600'>{seller.businessDescription}</p>
            //       )}
            //       <div className='mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600'>
            //         {seller.businessCity && <div>City: {seller.businessCity}</div>}
            //         {seller.businessCountry && <div>Country: {seller.businessCountry}</div>}
            //         {typeof seller.rating !== 'undefined' && <div>Rating: {seller.rating}</div>}
            //         {typeof seller.totalProducts !== 'undefined' && <div>Products: {seller.totalProducts}</div>}
            //       </div>
            //     </div>
            //   ))}
            // </div>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {sellers.map((vendor) => {
                const businessLogoImage = vendor?.businessLogoImage as any
                const profileImage = businessLogoImage?.url ?? '/images/user/user-01.png'
                return (
                  <Link
                    key={vendor.id}
                    href={`/services/${params.slug}/vendors/${vendor.id}`}
                    className='cursor-pointer rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl'
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <Flex align='center' gap='small'>
                        <div className='relative h-12 w-12 overflow-hidden rounded-full'>
                          <Image
                            src={profileImage}
                            width={60}
                            height={60}
                            alt={vendor.businessName ?? 'vendor info'}
                            className='object-cover'
                          />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-900'>{vendor.businessName}</h3>
                      </Flex>
                      {/* <h3 className='text-2xl font-bold text-gray-900'>{vendor.businessName}</h3> */}
                      {/* <div className='flex items-center gap-1'>
                          <span className='text-yellow-400'>★</span>
                          <span className='font-semibold'>{vendor.rating}</span>
                          <span className='text-gray-500'>({vendor.} reviews)</span>
                        </div> */}
                    </div>

                    <p className='mb-6 text-gray-600'>{vendor.businessDescription}</p>

                    {/* <div className='mb-6'>
                        <h4 className='mb-3 font-semibold text-gray-900'>Key Features:</h4> */}
                    {/* <div className='flex flex-wrap gap-2'>
                          {vendor.features.map((feature, index) => (
                            <span
                              key={index}
                              className='rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800'
                            >
                              {feature}
                            </span>
                          ))}
                        </div> */}
                    {/* </div> */}

                    <div className='border-t pt-6'>
                      <div className='flex items-center justify-between'>
                        <div className='space-y-1'>
                          <p className='text-sm text-gray-600'>
                            <span className='font-medium'>Contact:</span> {vendor.businessPhone}
                          </p>
                          <p className='text-sm text-gray-600'>
                            <span className='font-medium'>Website:</span> {vendor.businessWebsite}
                          </p>
                        </div>
                        <div className='font-semibold text-blue-600'>View Products →</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-blue-900 py-16 text-white'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Need More Information?</h2>
          <p className='mb-8 text-xl text-blue-200'>
            Our team can help you find the perfect vendor for your specific needs.
          </p>
          <button
            onClick={() => setIsContactPopupOpen(true)}
            className='rounded-lg bg-green-400 px-8 py-3 font-semibold text-blue-900 transition-colors hover:bg-green-500'
          >
            Get Personalized Recommendations
          </button>
        </div>
      </section>
      <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} />
      <ContactPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />
    </div>
  )
}
