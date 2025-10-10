'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

import { useForm } from 'react-hook-form'

import { TextAreaField } from '@/components/FormElements/Fields/TextAreaField'
import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { getBuyerCategories, type BuyerCategory } from '@/services/categories.services'
import { submitContactForm, type ContactRequest } from '@/services/contact.services'

interface ContactPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  categoryId: string
  subject: string
  message: string
}

export const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<BuyerCategory[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const categoriesLoadedRef = useRef(false)
  const { showToast } = useToast()

  const form = useForm<ContactFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      categoryId: '',
      subject: '',
      message: '',
    },
  })

  const loadCategories = useCallback(async () => {
    if (categoriesLoadedRef.current) return

    try {
      setIsLoadingCategories(true)
      const response = await getBuyerCategories()
      setCategories(response || [])
      categoriesLoadedRef.current = true
    } catch (error) {
      logger.error('Failed to load categories:', error)
      showToast('Failed to load categories. Please try again.', 'error')
    } finally {
      setIsLoadingCategories(false)
    }
  }, [showToast])

  // Load categories when popup opens (only once)
  useEffect(() => {
    if (isOpen && !categoriesLoadedRef.current) {
      loadCategories()
    }
  }, [isOpen, loadCategories])

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true)

      const contactData: ContactRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        categoryId: data.categoryId,
        subject: data.subject,
        message: data.message,
      }

      await submitContactForm(contactData)

      showToast('Your message has been sent successfully! We will get back to you soon.', 'success')
      form.reset()
      onClose()
    } catch (error) {
      logger.error('Contact form submission error:', error)
      showToast('Failed to send your message. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    setIsLoading(false)
    categoriesLoadedRef.current = false // Reset to allow reloading on next open
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-50 bg-black bg-opacity-50' onClick={handleClose} />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-lg rounded-lg bg-white p-6 shadow-xl'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>Contact Us</h2>
            <button
              onClick={handleClose}
              className='rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            >
              <Icon name='AiOutlineClose' className='h-5 w-5' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <TextField
                control={form.control}
                name='firstName'
                label='First Name'
                placeholder='Enter your first name'
                rules={{ required: 'First name is required' }}
              />
              <TextField
                control={form.control}
                name='lastName'
                label='Last Name'
                placeholder='Enter your last name'
                rules={{ required: 'Last name is required' }}
              />
            </div>

            <TextField
              control={form.control}
              name='email'
              label='Email'
              type='email'
              placeholder='Enter your email'
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
            />

            <SelectField
              control={form.control}
              name='categoryId'
              label='Service'
              placeholder={isLoadingCategories ? 'Loading Services...' : 'Select a Service'}
              items={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              rules={{ required: 'Please select a Service' }}
              disabled={isLoadingCategories}
            />

            <TextField
              control={form.control}
              name='subject'
              label='Subject'
              placeholder='Enter your subject'
              rules={{ required: 'Subject is required' }}
            />

            <TextAreaField
              control={form.control}
              name='message'
              label='Message'
              placeholder='Enter your message'
              rows={4}
              rules={{ required: 'Message is required' }}
            />

            <Button
              type='submit'
              label={isLoading ? 'Sending...' : 'Send Message'}
              disabled={isLoading}
              className='w-full'
            />
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              We&apos;ll get back to you as soon as possible. Usually within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
