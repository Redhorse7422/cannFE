import React, { useState, useEffect } from 'react'

import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'
import useToast from '@/hooks/useToast'
import { getGuestId } from '@/services/cart.guest'
import { checkGuestData, registerAndMigrate, type RegisterAndMigratePayload } from '@/services/guestMigration.services'

interface GuestMigrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (result: any) => void
}

interface MigrationFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
}

export const GuestMigrationModal: React.FC<GuestMigrationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [guestData, setGuestData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingData, setIsCheckingData] = useState(false)
  const { showToast } = useToast()

  const { control, handleSubmit, reset } = useForm<MigrationFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    },
  })

  // Check guest data when modal opens
  useEffect(() => {
    if (isOpen) {
      checkGuestDataOnOpen()
    }
  }, [isOpen])

  const checkGuestDataOnOpen = async () => {
    const guestId = getGuestId()
    if (!guestId) {
      showToast('No guest data found', 'error')
      onClose()
      return
    }

    try {
      setIsCheckingData(true)
      const response = await checkGuestData(guestId)
      if (response.success) {
        setGuestData(response.data)
      }
    } catch (error) {
      console.error('Failed to check guest data:', error)
      showToast('Failed to load guest data', 'error')
    } finally {
      setIsCheckingData(false)
    }
  }

  const onSubmit = async (data: MigrationFormData) => {
    const guestId = getGuestId()
    if (!guestId) {
      showToast('No guest data found', 'error')
      return
    }

    try {
      setIsLoading(true)
      const payload: RegisterAndMigratePayload = {
        guestId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      }

      const response = await registerAndMigrate(payload)
      if (response.success) {
        // Store the tokens in localStorage
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)

        // Sign in the user with the new credentials
        const signInResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          userType: 'buyer',
          redirect: false,
        })

        if (signInResult?.ok) {
          // Clear guest ID from localStorage
          localStorage.removeItem('cart_guest_id')

          showToast(
            `Account created successfully! ${response.data.migrationSummary.cartItemsMigrated} cart items, ${response.data.migrationSummary.ordersMigrated} orders migrated.`,
            'success',
          )

          onSuccess(response.data)
          onClose()
          reset()

          // Refresh the page to update the session
          window.location.reload()
        } else {
          showToast('Account created but login failed. Please try logging in manually.', 'error')
        }
      }
    } catch (error: any) {
      console.error('Migration failed:', error)
      if (error.message?.includes('already exists')) {
        showToast('An account with this email already exists. Please login instead.', 'error')
      } else if (error.message?.includes('No guest data')) {
        showToast('No guest data found to migrate. Please add items to cart first.', 'error')
      } else {
        showToast('Account creation failed. Please try again.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
      <div className='flex max-h-[90vh] w-full max-w-md flex-col rounded-lg bg-white shadow-xl'>
        <div className='flex-shrink-0 border-b border-gray-200 p-6 pb-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-bold text-gray-900'>Create Account</h2>
            <button
              onClick={onClose}
              className='rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              disabled={isLoading}
            >
              <Icon name='AiOutlineClose' className='h-5 w-5' />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-6 pt-4'>
          {isCheckingData ? (
            <div className='flex items-center justify-center py-8'>
              <div className='text-center'>
                <div className='mb-2 h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent'></div>
                <p className='text-sm text-gray-600'>Loading your data...</p>
              </div>
            </div>
          ) : (
            <>
              {guestData && (
                <div className='mb-6 rounded-lg bg-blue-50 p-4'>
                  <h3 className='mb-2 font-semibold text-blue-900'>Data to be migrated:</h3>
                  <ul className='space-y-1 text-sm text-blue-800'>
                    {guestData.guestData.hasCartItems && (
                      <li className='flex items-center'>
                        <Icon name='AiOutlineShopping' className='mr-2 h-4 w-4' />
                        {guestData.guestData.cartItemCount} cart items
                      </li>
                    )}
                    {guestData.guestData.hasOrders && (
                      <li className='flex items-center'>
                        <Icon name='AiOutlineFileText' className='mr-2 h-4 w-4' />
                        {guestData.guestData.orderCount} orders
                      </li>
                    )}
                    {guestData.orderHistory.length > 0 && (
                      <li className='flex items-center'>
                        <Icon name='AiOutlineFileText' className='mr-2 h-4 w-4' />
                        Order history will be preserved
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <TextField
                    control={control}
                    name='firstName'
                    label='First Name'
                    placeholder='Enter your first name'
                    rules={{ required: 'First name is required' }}
                  />
                  <TextField
                    control={control}
                    name='lastName'
                    label='Last Name'
                    placeholder='Enter your last name'
                    rules={{ required: 'Last name is required' }}
                  />
                </div>

                <TextField
                  control={control}
                  name='email'
                  label='Email Address'
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

                <TextField
                  control={control}
                  name='password'
                  label='Password'
                  type='password'
                  placeholder='Enter your password'
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  }}
                />

                <TextField
                  control={control}
                  name='phone'
                  label='Phone Number (Optional)'
                  placeholder='Enter your phone number'
                />

                <div className='mt-4 flex space-x-3 border-t border-gray-200 pt-4'>
                  <Button
                    type='button'
                    label='Cancel'
                    variant='outlinePrimary'
                    onClick={onClose}
                    disabled={isLoading}
                    className='flex-1'
                  />
                  <Button
                    type='submit'
                    label={isLoading ? 'Creating Account...' : 'Create Account'}
                    disabled={isLoading}
                    className='flex-1'
                  />
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
