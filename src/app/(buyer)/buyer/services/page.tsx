'use client'
import type { Category } from '@/types/common'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon } from '@/assets/icons'
import { ContactPopup } from '@/components/Auth/ContactPopup'
import { useApi } from '@/hooks/useApi'

const useServices = () => {
  const { getDataSource } = useApi()
  return getDataSource<Category[]>({
    path: '/v1/categories/buyer-categories',
  })
}

export default function ServicesPage() {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const { data: services, isLoading: servicesLoad } = useServices()
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <section className='bg-gradient-to-r from-blue-700 to-blue-400 py-16 text-white'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='text-center'>
            <h1 className='mb-4 text-4xl font-bold md:text-5xl'>Our Services</h1>
            <p className='mx-auto max-w-3xl text-xl text-blue-100'>
              Discover comprehensive solutions designed to enhance your healthcare practice and improve patient care.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className='py-16'>
        <div className='mx-auto max-w-7xl px-4'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {servicesLoad
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
              : Array.isArray(services) &&
                services.map((service: Category) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}`}
                    className='group cursor-pointer rounded-2xl bg-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl'
                  >
                    <div className='mb-4 flex items-start justify-between'>
                      <Image src={service.thumbnailImage.url} alt={service.name} width={80} height={80} />
                    </div>

                    <h3 className='mb-3 text-2xl font-bold text-gray-900'>{service.name}</h3>
                    <p className='mb-4 text-gray-600'>{service.description}</p>

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

      {/* CTA Section */}
      <section className='bg-blue-900 py-16 text-white'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Can nott Find What You are Looking For?</h2>
          <p className='mb-8 text-xl text-blue-200'>
            Our team can help you find the perfect solution for your specific needs.
          </p>
          <button
            onClick={() => setIsContactPopupOpen(true)}
            className='rounded-lg bg-green-400 px-8 py-3 font-semibold text-blue-900 transition-colors hover:bg-green-500'
          >
            Contact Our Team
          </button>
        </div>
      </section>
      {/* Contact Popup */}
      <ContactPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />
    </div>
  )
}
