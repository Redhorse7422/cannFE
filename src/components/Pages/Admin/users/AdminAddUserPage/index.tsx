'use client'

import type { CreateUserData } from '@/types/user'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { CheckboxField } from '@/components/FormElements/CheckboxInput'
import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { Grid, GridItem } from '@/libs/pureTailwind'

export const AdminAddUserPage = () => {
  const router = useRouter()
  const { createDataSource } = useApi()
  const { showToast } = useToast()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateUserData>({
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      isActive: true,
      email: '',
      phone: '',
      role: 'buyer',
      password: '',
    },
  })

  const onSubmit = async (data: CreateUserData) => {
    try {
      await createDataSource.mutateAsync({
        path: '/v1/users/register',
        body: {
          userName: data.userName.trim(),
          firstName: data.firstName,
          lastName: data.lastName,
          isActive: data.isActive,
          email: data.email,
          phone: data.phone,
          role: data.role,
          password: data.password,
        },
      })
      showToast('User created successfully!', 'success')
      router.push('/users')
    } catch (error) {
      logger.error('Failed to create user:', error)
      showToast('Failed to create user. Please try again.', 'error')
    }
  }

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'seller', label: 'Seller' },
    { value: 'buyer', label: 'Buyer' },
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            icon='AiOutlineArrowLeft'
            label='Back'
            variant='outlinePrimary'
            onClick={() => router.push('/users')}
          />
          <h1 className='text-2xl font-bold text-gray-900'>Add New User</h1>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='border-b border-gray-200 pb-4'>
            <h2 className='text-lg font-medium text-gray-900'>Basic Information</h2>
            <p className='mt-1 text-sm text-gray-600'>Enter the basic information for the new user.</p>
          </div>

          <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
            <GridItem colStart={{ default: 1, md: 1 }}>
              <TextField
                control={control}
                name='userName'
                label='User Name'
                placeholder='Enter user name'
                labelAxis='horizontal'
                labelWidth={160}
                rules={{ required: 'First user is required' }}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 2 }}>
              <CheckboxField name='isActive' label='Active' control={control} labelWidth={160} labelAxis='horizontal' />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 1 }}>
              <TextField
                control={control}
                name='firstName'
                label='First Name'
                placeholder='Enter first name'
                labelAxis='horizontal'
                labelWidth={160}
                rules={{ required: 'First name is required' }}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 2 }}>
              <TextField
                control={control}
                name='lastName'
                label='Last Name'
                placeholder='Enter last name'
                labelAxis='horizontal'
                labelWidth={160}
                rules={{ required: 'Last name is required' }}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 1 }}>
              <TextField
                control={control}
                name='email'
                label='Email Address'
                type='email'
                placeholder='Enter email address'
                labelAxis='horizontal'
                labelWidth={160}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                }}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 2 }}>
              <TextField
                control={control}
                name='phone'
                label='Phone Number'
                placeholder='Enter phone number'
                labelAxis='horizontal'
                labelWidth={160}
                // error={errors.phone?.message}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 1 }}>
              <SelectField
                control={control}
                name='role'
                label='Role'
                labelAxis='horizontal'
                labelWidth={160}
                items={roleOptions}
                // error={errors.role?.message}
                rules={{ required: 'Role is required' }}
              />
            </GridItem>
            <GridItem colStart={{ default: 1, md: 2 }}>
              <TextField
                control={control}
                name='password'
                label='Password'
                type='password'
                placeholder='Enter password'
                labelAxis='horizontal'
                labelWidth={160}
                // error={errors.password?.message}
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
              />
            </GridItem>
          </Grid>

          <div className='flex justify-end space-x-3 pt-6'>
            <Button label='Cancel' variant='outlinePrimary' onClick={() => router.push('/users')} type='button' />
            <Button
              label={isSubmitting ? 'Creating...' : 'Create User'}
              type='submit'
              disabled={isSubmitting}
              icon={isSubmitting ? 'AiOutlineLoading' : undefined}
            />
          </div>
        </form>
      </Card>
    </div>
  )
}
