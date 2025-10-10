'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'

interface SigninForm {
  email: string
  password: string
}

export const SigninWithPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const { control, handleSubmit } = useForm<SigninForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: SigninForm) => {
    try {
      setIsLoading(true)

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        userType: 'admin',
        redirect: false,
      })

      if (result?.error) {
        logger.error('Signin failed:', result.error)
        showToast('Invalid credentials. Please try again.', 'error')
        return
      }

      if (result?.ok) {
        showToast('Login successful!', 'success')
        router.push('/')
      }
    } catch (error) {
      logger.error('Signin error:', error)
      showToast('An error occurred during signin. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <TextField
        control={control}
        name='email'
        label='Email'
        placeholder='Enter your email'
        rules={{ required: 'Email is required' }}
      />
      <TextField
        control={control}
        name='password'
        label='Password'
        type='password'
        placeholder='Enter your password'
        rules={{ required: 'Password is required' }}
      />
      <Button type='submit' label={isLoading ? 'Signing in...' : 'Sign In'} disabled={isLoading} className='w-full' />
    </form>
  )
}
