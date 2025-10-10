'use client'

import React from 'react'

import Link from 'next/link'

import { CallIcon, EmailIcon, GlobeIcon } from '@/assets/icons'
import { Icon } from '@/components/common/icon'
const socialLinks = [
  { name: 'Facebook', href: '#', icon: <Icon name='FaFacebookF' color='white' /> },
  { name: 'Twitter', href: '#', icon: <Icon name='FaTwitter' color='white' /> },
  { name: 'Instagram', href: '#', icon: <Icon name='FaInstagram' color='white' /> },
  { name: 'YouTube', href: '#', icon: <Icon name='FaYoutube' color='white' /> },
]

export const BuyerTopBar: React.FC = () => {
  return (
    <div className='bg-gray-900 py-2 text-sm text-white'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between'>
          {/* Left Side - Contact Info & Promotional */}
          <div className='flex items-center space-x-6'>
            {/* Contact Info */}
            <div className='hidden items-center space-x-4 md:flex'>
              <div className='flex items-center space-x-1'>
                <CallIcon className='h-4 w-4 text-primary' />
                <span className='text-gray-300'>1-844-realGPO</span>
              </div>
              <div className='flex items-center space-x-1'>
                <EmailIcon className='h-4 w-4 text-primary' />
                <span className='text-gray-300'>info@aletheiascript.com</span>
              </div>
            </div>

            {/* Promotional Message */}
            <div className='hidden items-center space-x-1 lg:flex'>
              <GlobeIcon className='h-4 w-4 text-secondary' />
              <span className='text-gray-300'>Fast and reliable shipping</span>
            </div>
          </div>

          {/* Right Side - Social Media & Language */}
          <div className='flex items-center space-x-4'>
            {/* Social Media Links */}
            <div className='hidden items-center space-x-3 sm:flex'>
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className='text-gray-400 transition-colors hover:text-white'
                  title={social.name}
                >
                  <span className='text-lg'>{social.icon}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
