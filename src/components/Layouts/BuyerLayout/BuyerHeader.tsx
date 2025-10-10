'use client'

import React, { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { SearchIcon } from '@/assets/icons'
import LOGO from '@/assets/logos/logo.png'
import { LoginPopup } from '@/components/Auth/LoginPopup'
import { CartIcon } from '@/components/common/CartIcon'
import { Icon } from '@/components/common/icon'

import { UserDropdown } from './UserDropdown'
export const BuyerHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className='sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <Image src={LOGO} alt='Alethia Scripts' width={180} height={64} className='h-15 w-auto' />
            </Link>
          </div>

          {/* Search Bar */}
          <div className='mx-8 max-w-2xl flex-1'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search products, categories...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-primary'
              />
              <SearchIcon className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform' />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className='flex items-center space-x-6'>
            {/* <Link href='/cart' className='relative p-2 text-gray-600 transition-colors hover:text-primary'>
              <Icon name='AiOutlineShopping' size='2xl' />
              <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white'>
                2
              </span>
            </Link> */}

            <CartIcon />

            {/* User Menu */}
            {session?.user ? (
              <UserDropdown />
            ) : (
              <div className='relative'>
                <button
                  onClick={() => setIsLoginPopupOpen(true)}
                  className='flex items-center space-x-2 p-2 text-gray-600 transition-colors hover:text-primary'
                >
                  <Icon name='AiOutlineUser' size='2xl' />
                  <span className='hidden md:block'>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} />
    </header>
  )
}
