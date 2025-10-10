'use client'

import React from 'react'

import Image from 'next/image'
import Link from 'next/link'

import LOGO from '@/assets/logos/logo.png'

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'New Arrivals', href: '/new-arrivals' },
    { name: 'Best Sellers', href: '/best-sellers' },
    { name: 'Deals', href: '/deals' },
    { name: 'Clearance', href: '/clearance' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Returns', href: '/returns' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Blog', href: '/blog' },
    { name: 'Privacy Policy', href: '/privacy' },
  ],
}

export const BuyerFooter: React.FC = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5'>
          {/* Logo and Newsletter */}
          <div className='lg:col-span-2'>
            <div className='mb-6 flex items-center'>
              <Image src={LOGO} alt='Aletheia Scripts' width={120} height={64} className='h-16 w-auto' />
            </div>
            <p className='mb-6 max-w-md text-gray-300'>
              Discover amazing products at unbeatable prices. Shop the latest trends and find your perfect style.
            </p>

            {/* Newsletter Signup */}
            <div className='mb-6'>
              <h3 className='mb-3 text-lg font-semibold'>Stay Updated</h3>
              <div className='flex'>
                <input
                  type='email'
                  placeholder='Enter your email'
                  className='flex-1 rounded-l-lg border-0 px-4 py-2 text-gray-900 ring-2 focus:ring-primary'
                />
                <button className='rounded-r-lg bg-primary px-6 py-2 transition-colors hover:bg-primary/90'>
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Shop</h3>
            <ul className='space-y-2'>
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className='text-gray-300 transition-colors hover:text-white'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Support</h3>
            <ul className='space-y-2'>
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className='text-gray-300 transition-colors hover:text-white'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className='mb-4 text-lg font-semibold'>Company</h3>
            <ul className='space-y-2'>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className='text-gray-300 transition-colors hover:text-white'>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 border-t border-gray-800 pt-8'>
          <div className='flex flex-col items-center justify-between md:flex-row'>
            <p className='text-sm text-gray-400'>© {currentYear} Aletheia Scripts. All rights reserved.</p>
            <div className='mt-4 flex items-center space-x-6 md:mt-0'>
              <Link href='/terms' className='text-sm text-gray-400 transition-colors hover:text-white'>
                Terms of Service
              </Link>
              <Link href='/privacy' className='text-sm text-gray-400 transition-colors hover:text-white'>
                Privacy Policy
              </Link>
              <Link href='/cookies' className='text-sm text-gray-400 transition-colors hover:text-white'>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
