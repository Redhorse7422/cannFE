'use client'
import type { CreateSellerData, Seller, UpdateSellerData } from '@/types/seller'

import { useEffect } from 'react'

import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { TextAreaField } from '@/components/FormElements/Fields/TextAreaField'
import { MultiSelectField } from '@/components/FormElements/MultiSelectField'
const TiptapField = dynamic(() => import('@/components/FormElements/RichText/TiptapField'), { ssr: false })
import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { EnhancedUploadField } from '@/components/FormElements/UploadInput'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Icon } from '@/components/common/icon'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { Grid, GridItem } from '@/libs/pureTailwind'

type Category = {
  id: string
  name: string
}

//

type CategoriesResponse = {
  data: Category[]
}

type UsersResponse = {
  data: Array<{ id: string; email: string; firstName?: string; lastName?: string }>
}

// NOTE: Single-item endpoints return the unwrapped entity due to axios interceptor

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
  })

  const { data: categoriesResp, error: categoriesError } = getDataSource<CategoriesResponse>({
    path: '/v1/categories/all',
    query: { limit: 200 },
  })

  const categoryOptions = Array.isArray(categoriesResp?.data)
    ? categoriesResp.data.map((cat: Category) => ({ value: cat.id, label: cat.name }))
    : []

  // Fetch users for dropdown
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = getDataSource<UsersResponse>({
    path: '/v1/users',
    query: {
      limit: 1000,
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
    watch,
  } = useForm<CreateSellerData>({
    defaultValues: {
      userId: '',
      businessName: '',
      businessDescription: '',
      longDescription: '',
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
      categoryIds: [],
      businessLogo: [],
    },
  })

  // Load seller data for edit mode
  useEffect(() => {
    if (isEditMode && seller) {
      const sellerData = seller as Seller
      reset({
        userId: sellerData.userId,
        businessName: sellerData.businessName || '',
        businessDescription: sellerData.businessDescription || '',
        longDescription: sellerData.longDescription || '',
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
        categoryIds: sellerData.categories?.map((item: Category) => item.id) ?? [],
        // businessLogoId: sellerData.businessLogo?.[0]?.file ?? null,
        // businessLogo: sellerData.businessLogo?.length ? sellerData.businessLogo[0] : null,
        businessLogo: sellerData.businessLogoImage ? [(sellerData as any).businessLogoImage] : [],
      })
    }
  }, [isEditMode, seller, reset])

  const watchedUserId = watch('userId')

  const onSubmit = async (data: CreateSellerData) => {
    console.log('Paylaod ==> ', data)

    // Validate userId is selected
    const finalUserId = data.userId || watchedUserId

    console.log('UserId ==> ', finalUserId)

    if (!finalUserId) {
      showToast('Please select a user', 'error')
      return
    }

    try {
      if (isEditMode) {
        await updateDataSource.mutateAsync({
          path: `/v1/sellers/${sellerId}`,
          body: {
            // ...(data as UpdateSellerData as unknown as Record<string, unknown>),
            ...(data.businessName && { businessName: data.businessName }),
            ...(data.businessDescription && { businessDescription: data.businessDescription }),
            ...(data.longDescription && { longDescription: data.longDescription }),
            ...(data.businessPhone && { businessPhone: data.businessPhone }),
            ...(data.businessEmail && { businessEmail: data.businessEmail }),
            ...(data.businessWebsite && { businessWebsite: data.businessWebsite }),
            ...(data.businessAddress && { businessAddress: data.businessAddress }),
            ...(data.businessCity && { businessCity: data.businessCity }),
            ...(data.businessState && { businessState: data.businessState }),
            ...(data.businessPostalCode && { businessPostalCode: data.businessPostalCode }),
            ...(data.businessCountry && { businessCountry: data.businessCountry }),
            ...(data.taxId && { taxId: data.taxId }),
            ...(data.licenseNumber && { licenseNumber: data.licenseNumber }),
            ...(data.licenseExpiryDate && { licenseExpiryDate: data.licenseExpiryDate }),
            ...(data.status && { status: data.status }),
            ...(data.verificationStatus && { verificationStatus: data.verificationStatus }),
            ...(data.verificationDocuments && { verificationDocuments: data.verificationDocuments }),
            ...(data.profileImage && { profileImage: data.profileImage }),
            ...(data.bannerImage && { bannerImage: data.bannerImage }),
            ...(data.commissionRate !== undefined && { commissionRate: data.commissionRate }),
            ...(data.payoutMethod && { payoutMethod: data.payoutMethod }),
            ...(data.payoutDetails && { payoutDetails: data.payoutDetails }),
            ...(data.notes && { notes: data.notes }),
            ...(data.categoryIds?.length && { categoryIds: data.categoryIds }),
            // send only first businessLogo fileId if present
            ...(data.businessLogo?.[0]?.fileId && { businessLogoId: data.businessLogo[0].fileId }),
            userId: finalUserId,
          },
        })
        showToast('Seller updated successfully!', 'success')
      } else {
        await createDataSource.mutateAsync({
          path: '/v1/sellers',
          body: {
            ...(data as unknown as Record<string, unknown>),
            businessLogoId: data.businessLogo?.[0]?.fileId ?? null,
          },
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
  const userOptionsList = (usersData?.data?.map((user) => ({
    value: user.id,
    label: `${user.firstName || ''} ${user.lastName || ''} (${user.email})`.trim() || user.email,
  })) || []) as { value: string; label: string }[]

  // Ensure current seller's user appears in options in edit mode even if users list isn't loaded yet
  if (isEditMode && seller) {
    const exists = userOptionsList.some((opt) => opt.value === (seller as Seller).userId)
    if (!exists) {
      userOptionsList.unshift({
        value: (seller as Seller).userId,
        label: (seller as Seller).user
          ? `${(seller as Seller).user?.firstName ?? ''} ${(seller as Seller).user?.lastName ?? ''} (${(seller as Seller).user?.email ?? ''})`.trim()
          : 'Current User',
      })
    }
  }

  const userOptions = [{ value: '', label: 'Select User' }, ...userOptionsList]

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
                    validate: (value) => (value && value !== '') || 'Please select a user',
                  }}
                />
                {usersError && <div className='mt-1 text-xs text-red-500'>Failed to load users</div>}
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
              <GridItem colSpan={{ default: 1, md: 2 }}>
                <MultiSelectField label='Services' items={categoryOptions} name='categoryIds' control={control} />
                {categoriesError && <div className='mt-1 text-xs text-red-500'>Failed to load categories</div>}
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
              <GridItem>
                <EnhancedUploadField
                  uploadMode='upload'
                  control={control}
                  name='businessLogo'
                  uploadUrl='/api/v1/media/upload'
                  uploadFieldName='file'
                  valueField='full'
                  dragBoxTitle='Product Thumbnail'
                  accept={['.jpeg', '.jpg', '.png', '.webp']}
                  label='Business Logo'
                  labelAxis='horizontal'
                  labelWidth={180}
                  rules={{
                    required: 'Business Logo is required',
                  }}
                />
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
            <TiptapField
              control={control}
              name='longDescription'
              label='Long Description'
              placeholder='Detailed Seller description'
            />
            {/* <TextAreaField control={control} name='notes' label='Notes' placeholder='Enter notes' /> */}
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
