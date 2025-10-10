'use client'
import type { Category } from '@/types/common'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { ArrowRightIcon } from '@/assets/icons'
import { ContactPopup } from '@/components/Auth/ContactPopup'
import Carousel from '@/components/ui/Carousel'
import { useApi } from '@/hooks/useApi'

// Get Services
const useServices = () => {
  const { getDataSource } = useApi()
  return getDataSource<Category[]>({
    path: '/v1/categories/buyer-categories',
  })
}

export const BuyerHomePage: React.FC = () => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false)
  const { data: services, isLoading: servicesLoad } = useServices()
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section - replaced by Carousel (banner kept for reference) */}
      {/*
      <section className='relative bg-gradient-to-r from-blue-700 to-blue-400 py-20 text-white'>
        <div className='mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 md:flex-row'>
          <div className='flex-1'>
            <h1 className='mb-6 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl'>
              Empowering <span className='text-green-300'>Healthcare Providers</span>
            </h1>
            <p className='mb-8 text-lg text-blue-100 md:text-xl'>
              Complete solutions to improve care and increase revenue for physicians, independent pharmacies, and
              veterinarians.
            </p>
            <button onClick={() => router.push('/how-it-works')} className='rounded-lg bg-green-400 px-8 py-3 text-lg font-semibold text-blue-900 shadow-lg transition-colors hover:bg-green-500'>
              Learn More
            </button>
          </div>
          <div className='flex flex-1 justify-center'>
            <div className='flex h-80 w-full max-w-md items-center justify-center rounded-2xl bg-white/10'>
              <span className='text-6xl'>🏥</span>
            </div>
          </div>
        </div>
      </section>
      */}

      <section className='py-6'>
        <Carousel
          slides={[
            {
              id: 'c1',
              subtitle: 'For Providers',
              title: 'Improve care and increase revenue',
              ctaText: 'Learn More',
              ctaHref: '/how-it-works',
              imageSrc: '/images/carousel/carousel-01.jpg',
            },
            {
              id: 'c2',
              subtitle: 'Exclusive Deals',
              title: 'Unlock discounts on services and supplies',
              ctaText: 'Browse Services',
              ctaHref: '/services',
              imageSrc: '/images/carousel/carousel-02.jpg',
            },
            {
              id: 'c3',
              subtitle: 'Seamless Onboarding',
              title: 'Get started in minutes with 24/7 support',
              ctaText: 'Create Account',
              ctaHref: '/sign-up',
              imageSrc: '/images/carousel/carousel-03.jpg',
            },
          ]}
        />
      </section>

      {/* Services Section */}
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-7xl px-4'>
          <h2 className='mb-12 text-center text-3xl font-bold text-blue-900'>Our Services</h2>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
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
                services.map((service) => (
                  <Link
                    key={service.name}
                    href={`/services/${service.slug}`}
                    className='flex cursor-pointer flex-col items-center rounded-2xl bg-blue-50 p-8 text-center shadow transition-all hover:scale-105 hover:shadow-lg'
                  >
                    <Image
                      src={service.thumbnailImage.url}
                      alt={service.name}
                      width={100}
                      height={100}
                      className='mb-2'
                    />
                    <h3 className='mb-2 text-xl font-semibold text-blue-900'>{service.name}</h3>
                    <p className='text-sm text-gray-600'>{service.description}</p>
                  </Link>
                ))}
          </div>

          {/* View All Services Button */}
          <div className='mt-12 text-center'>
            <Link
              href='/services'
              className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700'
            >
              View All Services
              <ArrowRightIcon className='h-5 w-5' />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section (Dummy) */}
      <section className='bg-gradient-to-r from-blue-50 to-green-50 py-20'>
        <div className='mx-auto max-w-5xl px-4'>
          <h2 className='mb-12 text-center text-3xl font-bold text-blue-900'>How It Works</h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            {[
              { icon: '📝', title: 'Sign Up', desc: 'Create your free account in minutes.' },
              { icon: '🔍', title: 'Explore Services', desc: 'Browse and select the services you need.' },
              { icon: '🤝', title: 'Get Support', desc: 'Our team helps you implement and optimize.' },
              { icon: '🚀', title: 'Grow', desc: 'See measurable improvements in care and revenue.' },
            ].map((step) => (
              <div key={step.title} className='flex flex-col items-center rounded-xl bg-white p-6 text-center shadow'>
                <div className='mb-3 text-4xl'>{step.icon}</div>
                <h4 className='mb-1 font-semibold text-blue-800'>{step.title}</h4>
                <p className='text-sm text-gray-500'>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section (Dummy) */}
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-6xl px-4'>
          <h2 className='mb-12 text-center text-3xl font-bold text-blue-900'>Why Choose Us?</h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            {[
              { icon: '🤝', title: 'Trusted Partners', desc: 'We work with leading organizations in healthcare.' },
              { icon: '💰', title: 'Cost Savings', desc: 'Exclusive discounts and negotiated contracts.' },
              { icon: '🕑', title: '24/7 Support', desc: 'Our team is always here to help you.' },
              { icon: '🔒', title: 'Secure Platform', desc: 'Your data and privacy are our top priority.' },
            ].map((feature) => (
              <div
                key={feature.title}
                className='flex flex-col items-center rounded-xl bg-blue-50 p-8 text-center shadow'
              >
                <div className='mb-3 text-4xl'>{feature.icon}</div>
                <h4 className='mb-1 font-semibold text-blue-800'>{feature.title}</h4>
                <p className='text-sm text-gray-500'>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section (Dummy) */}
      <section className='bg-gradient-to-r from-green-50 to-blue-50 py-20'>
        <div className='mx-auto max-w-5xl px-4'>
          <h2 className='mb-12 text-center text-3xl font-bold text-blue-900'>What Our Clients Say</h2>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
            {[
              {
                name: 'Dr. Smith',
                quote: 'This platform transformed my practice. The support and savings are unmatched.',
              },
              {
                name: 'Pharmacy Owner',
                quote: 'Access to discounted supplies and pharmaceuticals has been a game changer.',
              },
              { name: 'Clinic Manager', quote: 'The onboarding was seamless and the team is always available.' },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className='flex flex-col items-center rounded-xl bg-white p-8 text-center shadow'
              >
                <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-200 text-2xl'>
                  👤
                </div>
                <p className='mb-2 italic text-gray-700'>&ldquo;{testimonial.quote}&rdquo;</p>
                <span className='font-semibold text-blue-800'>{testimonial.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section (Dummy) */}
      <section className='bg-white py-16'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='mb-8 text-2xl font-bold text-blue-900'>Our Partners</h2>
          <div className='flex flex-wrap items-center justify-center gap-8'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className='flex h-16 w-32 items-center justify-center rounded-lg bg-blue-100 text-2xl font-bold text-blue-400 shadow'
              >
                Logo
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Dummy) */}
      <section className='bg-gradient-to-r from-blue-50 to-green-50 py-20'>
        <div className='mx-auto max-w-3xl px-4'>
          <h2 className='mb-12 text-center text-3xl font-bold text-blue-900'>Frequently Asked Questions</h2>
          <div className='space-y-6'>
            {[
              {
                q: 'Who can use this platform?',
                a: 'Physicians, independent pharmacies, veterinarians, and other healthcare providers.',
              },
              { q: 'Is there a setup fee?', a: 'No, creating an account and getting started is free.' },
              {
                q: 'How do I access discounted pricing?',
                a: 'Sign up and browse our services to see exclusive offers.',
              },
              { q: 'Is support available?', a: 'Yes, our team is available 24/7 to assist you.' },
            ].map((faq, idx) => (
              <div key={idx} className='rounded-xl bg-white p-6 shadow'>
                <h4 className='mb-2 font-semibold text-blue-800'>Q: {faq.q}</h4>
                <p className='text-gray-600'>A: {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='bg-blue-900 py-16 text-white'>
        <div className='mx-auto max-w-4xl px-4 text-center'>
          <h2 className='mb-4 text-3xl font-bold'>Stay in the Loop</h2>
          <p className='mb-8 text-lg text-blue-200'>
            Subscribe to our newsletter and be the first to know about new services, exclusive deals, and special
            offers.
          </p>
          <div className='mx-auto flex max-w-md flex-col gap-4 sm:flex-row'>
            <input
              type='email'
              placeholder='Enter your email address'
              className='flex-1 rounded-lg border-0 px-4 py-3 text-blue-900 focus:ring-2 focus:ring-green-400'
            />
            <button className='rounded-lg bg-green-400 px-8 py-3 font-semibold text-blue-900 transition-colors hover:bg-green-500'>
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Contact/CTA Section (Dummy) */}
      <section className='bg-white py-20'>
        <div className='mx-auto max-w-2xl px-4 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-blue-900'>Ready to Transform Your Practice?</h2>
          <p className='mb-8 text-lg text-gray-700'>
            Contact us today to learn how we can help you grow and succeed in the healthcare industry.
          </p>
          <button
            onClick={() => setIsContactPopupOpen(true)}
            className='rounded-lg bg-blue-700 px-10 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-blue-800'
          >
            Contact Us
          </button>
        </div>
      </section>
      {/* Contact Popup */}
      <ContactPopup isOpen={isContactPopupOpen} onClose={() => setIsContactPopupOpen(false)} />
    </div>
  )
}
