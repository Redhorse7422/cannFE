'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/icon'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'

interface LoginPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface SigninForm {
  email: string
  password: string
}

interface SignupForm {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  businessLicenseNumber: string
  businessLicenseExpiryDate: string
}

type AuthMode = 'signin' | 'signup'

export const LoginPopup: React.FC<LoginPopupProps> = ({ isOpen, onClose }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  // Signin form
  const signinForm = useForm<SigninForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Signup form
  const signupForm = useForm<SignupForm>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessLicenseNumber: '',
      businessLicenseExpiryDate: '',
    },
  })

  const password = signupForm.watch('password')

  const onSigninSubmit = async (data: SigninForm) => {
    try {
      setIsLoading(true)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        userType: 'buyer',
        redirect: false,
      })

      if (result?.error) {
        logger.error('Signin failed:', result.error)
        showToast('Invalid credentials. Please try again.', 'error')
        return
      }

      if (result?.ok) {
        showToast('Login successful!', 'success')
        signinForm.reset()
        onClose()
        // Optionally refresh the page or update the header state
        window.location.reload()
      }
    } catch (error) {
      logger.error('Signin error:', error)
      showToast('An error occurred during signin. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignupSubmit = async (data: SignupForm) => {
    try {
      setIsLoading(true)

      // Call signup API
      const response = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          businessLicenseNumber: data.businessLicenseNumber,
          businessLicenseExpiryDate: data.businessLicenseExpiryDate,
          type: 'buyer',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        logger.error('Signup failed:', result.message)
        showToast(result.message || 'Signup failed. Please try again.', 'error')
        return
      }

      showToast('Account created successfully! Please sign in.', 'success')
      signupForm.reset()
      setAuthMode('signin')
    } catch (error) {
      logger.error('Signup error:', error)
      showToast('An error occurred during signup. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setAuthMode('signin')
    signinForm.reset()
    signupForm.reset()
    setIsLoading(false)
    onClose()
  }

  const switchToSignup = () => {
    router.push('/sign-up')
    onClose()
  }

  const switchToSignin = () => {
    setAuthMode('signin')
    signupForm.reset()
    setIsLoading(false)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className='fixed inset-0 z-50 bg-black bg-opacity-50' onClick={handleClose} />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-xl'>
          {/* Header */}
          <div className='mb-6 flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-gray-900'>
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
            <button
              onClick={handleClose}
              className='rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            >
              <Icon name='AiOutlineClose' className='h-5 w-5' />
            </button>
          </div>

          {/* Signin Form */}
          {authMode === 'signin' && (
            <>
              <form onSubmit={signinForm.handleSubmit(onSigninSubmit)} className='space-y-4'>
                <TextField
                  control={signinForm.control}
                  name='email'
                  label='Email'
                  placeholder='Enter your email'
                  rules={{ required: 'Email is required' }}
                />
                <TextField
                  control={signinForm.control}
                  name='password'
                  label='Password'
                  type='password'
                  placeholder='Enter your password'
                  rules={{ required: 'Password is required' }}
                />
                <Button
                  type='submit'
                  label={isLoading ? 'Signing in...' : 'Sign In'}
                  disabled={isLoading}
                  className='w-full'
                />
              </form>

              {/* Footer */}
              <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                  Don&apos;t have an account?{' '}
                  <button onClick={switchToSignup} className='text-primary hover:underline'>
                    Sign Up
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Signup Form */}
          {authMode === 'signup' && (
            <>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <TextField
                    control={signupForm.control}
                    name='firstName'
                    label='First Name'
                    placeholder='Enter first name'
                    rules={{ required: 'First name is required' }}
                  />
                  <TextField
                    control={signupForm.control}
                    name='lastName'
                    label='Last Name'
                    placeholder='Enter last name'
                    rules={{ required: 'Last name is required' }}
                  />
                </div>

                <TextField
                  control={signupForm.control}
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

                <div className='grid grid-cols-2 gap-4'>
                  <TextField
                    control={signupForm.control}
                    name='businessLicenseNumber'
                    label='Business License Number'
                    type='text'
                    placeholder='Enter your Business License Number'
                    rules={{
                      required: 'Business License Number is required',
                    }}
                  />
                  <TextField
                    control={signupForm.control}
                    name='businessLicenseExpiryDate'
                    label='License Expiry Date'
                    type='date'
                    placeholder='Enter your License Expiry Date'
                    rules={{
                      required: 'License Expiry Date is required',
                    }}
                  />
                </div>

                <TextField
                  control={signupForm.control}
                  name='password'
                  label='Password'
                  type='password'
                  placeholder='Enter password'
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  }}
                />

                <TextField
                  control={signupForm.control}
                  name='confirmPassword'
                  label='Confirm Password'
                  type='password'
                  placeholder='Confirm password'
                  rules={{
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  }}
                />

                <Button
                  type='submit'
                  label={isLoading ? 'Creating Account...' : 'Create Account'}
                  disabled={isLoading}
                  className='w-full'
                />
              </form>

              {/* Footer */}
              <div className='mt-6 text-center'>
                <p className='text-sm text-gray-600'>
                  Already have an account?{' '}
                  <button onClick={switchToSignin} className='text-primary hover:underline'>
                    Sign In
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
