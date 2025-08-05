'use client'
import type { CreateSellerData, Seller, UpdateSellerData } from '@/types/seller'

import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { TextAreaField } from '@/components/FormElements/Fields/TextAreaField'
import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Icon } from '@/components/common/icon'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { Grid, GridItem } from '@/libs/pureTailwind'

export const AdminSellerFormPage = () => {
  const params = useParams()
  const router = useRouter()
  const sellerId = params.id as string
  const isEditMode = !!sellerId
  const { showToast } = useToast()

  const { getDataSourceById, createDataSource, updateDataSource, getDataSource } = useApi()

  const {
    data: seller,
    isLoading,
    error,
  } = getDataSourceById<Seller>({
    path: '/v1/sellers',
    id: sellerId,
    enabled: isEditMode,
    query: {
      id: sellerId,
    },

    // params: {
    //   includeUser: 'true',
    // },
  })

  // Fetch users for dropdown
  const { data: usersData, isLoading: usersLoading } = getDataSource<{
    data: Array<{ id: string; email: string; firstName?: string; lastName?: string }>
  }>({
    path: '/v1/users',
    query: {
      limit: 1000, // Get all users
      // sort: 'firstName',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateSellerData>({
    defaultValues: {
      userId: '',
      businessName: '',
      businessDescription: '',
      businessPhone: '',
      businessEmail: '',
      businessWebsite: '',
      businessAddress: '',
      businessCity: '',
      businessState: '',
      businessPostalCode: '',
      businessCountry: '',
      taxId: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      status: 'pending',
      verificationStatus: 'unverified',
      verificationDocuments: '',
      profileImage: '',
      bannerImage: '',
      commissionRate: 0,
      payoutMethod: '',
      payoutDetails: '',
      notes: '',
    },
  })

  // Watch the userId field for debugging
  const watchedUserId = watch('userId')
  console.log('Watched userId:', watchedUserId)

  console.log('Seller ===> ', seller)

  // Load seller data for edit mode
  useEffect(() => {
    if (isEditMode && seller) {
      const sellerData = seller
      reset({
        userId: sellerData.userId,
        businessName: sellerData.businessName || '',
        businessDescription: sellerData.businessDescription || '',
        businessPhone: sellerData.businessPhone || '',
        businessEmail: sellerData.businessEmail || '',
        businessWebsite: sellerData.businessWebsite || '',
        businessAddress: sellerData.businessAddress || '',
        businessCity: sellerData.businessCity || '',
        businessState: sellerData.businessState || '',
        businessPostalCode: sellerData.businessPostalCode || '',
        businessCountry: sellerData.businessCountry || '',
        taxId: sellerData.taxId || '',
        licenseNumber: sellerData.licenseNumber || '',
        licenseExpiryDate: sellerData.licenseExpiryDate ? sellerData.licenseExpiryDate.split('T')[0] : '',
        status: sellerData.status,
        verificationStatus: sellerData.verificationStatus,
        verificationDocuments: sellerData.verificationDocuments || '',
        profileImage: sellerData.profileImage || '',
        bannerImage: sellerData.bannerImage || '',
        commissionRate: sellerData.commissionRate || 0,
        payoutMethod: sellerData.payoutMethod || '',
        payoutDetails: sellerData.payoutDetails || '',
        notes: sellerData.notes || '',
      })
    }
  }, [isEditMode, seller, reset])

  // Prevent form reset from overwriting user selection in create mode
  useEffect(() => {
    if (!isEditMode && watchedUserId) {
      // In create mode, if user selects a userId, ensure it's preserved
      console.log('User selected in create mode:', watchedUserId)
      // Ensure the userId is set in the form
      setValue('userId', watchedUserId)
    }
  }, [isEditMode, watchedUserId, setValue])

  const onSubmit = async (data: CreateSellerData) => {
    console.log('Full form data ==> ', data)
    console.log('userId type ==> ', typeof data.userId)
    console.log('userId value ==> ', data.userId)
    console.log('watchedUserId ==> ', watchedUserId)
    console.log('userOptions ==> ', userOptions)
    
    // Use watchedUserId as fallback if data.userId is undefined
    const finalUserId = data.userId || watchedUserId
    
    // Validate userId is selected
    if (!finalUserId || finalUserId === '') {
      showToast('Please select a user', 'error')
      return
    }
    
    // Prepare the payload
    const payload = {
      ...data,
      userId: finalUserId,
    }
    
    console.log('Final payload ==> ', payload)
    
    try {
      if (isEditMode) {
        await updateDataSource.mutateAsync({
          path: `/v1/sellers/${sellerId}`,
          body: payload as UpdateSellerData as unknown as Record<string, unknown>,
        })
        showToast('Seller updated successfully!', 'success')
      } else {
        await createDataSource.mutateAsync({
          path: '/v1/sellers',
          body: payload as unknown as Record<string, unknown>,
        })
        showToast('Seller created successfully!', 'success')
      }
      router.push('/sellers')
    } catch (error1) {
      logger.error('Failed to save seller:', error1)
      showToast('Failed to save seller. Please try again.', 'error')
    }
  }

  if (isEditMode && isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <Icon name='AiOutlineLoading' className='mx-auto h-8 w-8 animate-spin text-primary' />
          <p className='mt-2 text-gray-600'>Loading seller details...</p>
        </div>
      </div>
    )
  }

  if (isEditMode && (error || !seller)) {
    logger.error('Failed to fetch seller:', error)
    return (
      <div className='rounded-lg bg-white p-6 shadow'>
        <div className='text-center'>
          <Icon name='AiOutlineCloseCircle' className='mx-auto h-12 w-12 text-red-500' />
          <h2 className='mt-4 text-xl font-semibold text-gray-900'>Seller Not Found</h2>
          <p className='mt-2 text-gray-600'>The seller you are looking for does not exist or has been deleted.</p>
          <Button label='Back to Sellers' onClick={() => router.push('/sellers')} className='mt-4' />
        </div>
      </div>
    )
  }

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'inactive', label: 'Inactive' },
  ]

  const verificationStatusOptions = [
    { value: 'unverified', label: 'Unverified' },
    { value: 'pending', label: 'Pending Verification' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Verification Rejected' },
  ]

  const payoutMethodOptions = [
    { value: '', label: 'Select Payout Method' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' },
    { value: 'check', label: 'Check' },
  ]

  // Prepare users dropdown options
  const userOptions = [
    { value: '', label: 'Select User' },
    ...(usersData?.data?.map((user) => ({
      value: user.id,
      label: `${user.firstName || ''} ${user.lastName || ''} (${user.email})`.trim() || user.email,
    })) || []),
  ]

  console.log('Userr ===> ', userOptions)

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button label='Back' icon='AiOutlineArrowLeft' variant='primary' onClick={() => router.push('/sellers')} />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{isEditMode ? 'Edit Seller' : 'Create New Seller'}</h1>
            <p className='text-gray-600'>
              {isEditMode ? 'Update seller information' : 'Add a new seller to the platform'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-6'>
          {/* Basic Information */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Basic Information</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
                             <GridItem>
                 <SelectField
                   control={control}
                   name='userId'
                   label='User'
                   items={userOptions}
                   required
                   disabled={isEditMode || usersLoading}
                   placeholder='Select User'
                   rules={{
                     required: 'Please select a user',
                     validate: (value) => value && value !== '' || 'Please select a user',
                   }}
                 />
                 <div className='text-xs text-gray-500 mt-1'>
                   Selected User ID: {watchedUserId || 'None'}
                 </div>
               </GridItem>
              <GridItem>
                <TextField control={control} name='businessName' label='Business Name' />
              </GridItem>
              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextAreaField
                  control={control}
                  name='businessDescription'
                  label='Business Description'
                  placeholder='Enter business description'
                />
              </GridItem>
            </Grid>
          </Card>

          {/* Contact Information */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Contact Information</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField control={control} name='businessEmail' label='Business Email' type='email' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='businessPhone' label='Business Phone' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='businessWebsite' label='Business Website' type='url' />
              </GridItem>
            </Grid>
          </Card>

          {/* Address Information */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Address Information</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextField control={control} name='businessAddress' label='Business Address' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='businessCity' label='City' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='businessState' label='State/Province' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='businessPostalCode' label='Postal Code' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='businessCountry' label='Country' />
              </GridItem>
            </Grid>
          </Card>

          {/* Legal Information */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Legal Information</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField control={control} name='taxId' label='Tax ID' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='licenseNumber' label='License Number' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='licenseExpiryDate' label='License Expiry Date' type='date' />
              </GridItem>
            </Grid>
          </Card>

          {/* Status & Verification */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Status & Verification</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <SelectField control={control} name='status' label='Status' items={statusOptions} />
              </GridItem>
              <GridItem>
                <SelectField
                  control={control}
                  name='verificationStatus'
                  label='Verification Status'
                  items={verificationStatusOptions}
                />
              </GridItem>
              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextField control={control} name='verificationDocuments' label='Verification Documents' />
              </GridItem>
            </Grid>
          </Card>

          {/* Financial Information */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Financial Information</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField
                  control={control}
                  name='commissionRate'
                  label='Commission Rate (%)'
                  type='number'
                  // min='0'
                  // max='100'
                  // step='0.1'
                />
              </GridItem>
              <GridItem>
                <SelectField control={control} name='payoutMethod' label='Payout Method' items={payoutMethodOptions} />
              </GridItem>
              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextAreaField
                  control={control}
                  name='payoutDetails'
                  label='Payout Details'
                  placeholder='Enter payout details'
                />
              </GridItem>
            </Grid>
          </Card>

          {/* Images */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Images</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField control={control} name='profileImage' label='Profile Image URL' type='url' />
              </GridItem>
              <GridItem>
                <TextField control={control} name='bannerImage' label='Banner Image URL' type='url' />
              </GridItem>
            </Grid>
          </Card>

          {/* Notes */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Additional Information</h3>
            <TextAreaField control={control} name='notes' label='Notes' placeholder='Enter notes' />
          </Card>

          {/* Submit Buttons */}
          <div className='flex justify-end gap-3'>
            <Button label='Cancel' variant='outlinePrimary' onClick={() => router.push('/sellers')} type='button' />
            <Button label={isEditMode ? 'Update Seller' : 'Create Seller'} type='submit' loading={isSubmitting} />
          </div>
        </div>
      </form>
    </div>
  )
}
