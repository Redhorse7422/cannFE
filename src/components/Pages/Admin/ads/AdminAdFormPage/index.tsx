'use client'
import type { Ad, CreateAdData, UpdateAdData } from '@/types/ad'

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

type Seller = {
  id: string
  businessName: string
}

type Customer = {
  id: string
  firstName: string
  lastName: string
  email: string
}

type SellersResponse = {
  data: Seller[]
}

type CustomersResponse = {
  data: Customer[]
}

export const AdminAdFormPage = () => {
  const params = useParams()
  const router = useRouter()
  const adId = params.id as string
  const isEditMode = !!adId
  const { showToast } = useToast()

  const { getDataSourceById, createDataSource, updateDataSource, getDataSource } = useApi()

  const {
    data: ad,
    isLoading,
    error,
  } = getDataSourceById<Ad>({
    path: '/v1/ads',
    id: adId,
    enabled: isEditMode,
    query: {
      id: adId,
    },
  })

  // Fetch sellers for dropdown
  const { data: sellersResp } = getDataSource<SellersResponse>({
    path: '/v1/sellers',
    query: { limit: 200 },
  })

  const sellerOptions = [
    { value: '', label: 'None (Platform Ad)' },
    ...(Array.isArray(sellersResp?.data)
      ? sellersResp.data.map((seller: Seller) => ({ value: seller.id, label: seller.businessName }))
      : []),
  ]

  // Fetch customers for dropdown
  const { data: customersResp } = getDataSource<CustomersResponse>({
    path: '/v1/users',
    query: { limit: 200 },
  })

  const customerOptions = [
    { value: '', label: 'None' },
    ...(Array.isArray(customersResp?.data)
      ? customersResp.data.map((customer: Customer) => ({
          value: customer.id,
          label: `${customer.firstName} ${customer.lastName} (${customer.email})`,
        }))
      : []),
  ]

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateAdData>({
    defaultValues: {
      placementKey: '',
      sellerId: '',
      customerId: '',
      title: '',
      description: '',
      mediaUrl: '',
      linkUrl: '',
      status: 'draft',
      startAt: '',
      endAt: '',
      weight: 1,
      maxImpressionsPerDay: undefined,
      targeting: {
        categorySlug: '',
        productType: '',
        country: '',
        device: undefined,
        pagePathPattern: '',
      },
    },
  })

  // Load ad data for edit mode
  useEffect(() => {
    if (isEditMode && ad) {
      const adData = ad as Ad
      reset({
        placementKey: adData.placementKey || '',
        sellerId: adData.sellerId || '',
        customerId: adData.customerId || '',
        title: adData.title || '',
        description: adData.description || '',
        mediaUrl: adData.mediaUrl || '',
        linkUrl: adData.linkUrl || '',
        status: adData.status,
        startAt: adData.startAt ? adData.startAt.split('T')[0] + 'T' + adData.startAt.split('T')[1]?.slice(0, 5) : '',
        endAt: adData.endAt ? adData.endAt.split('T')[0] + 'T' + adData.endAt.split('T')[1]?.slice(0, 5) : '',
        weight: adData.weight || 1,
        maxImpressionsPerDay: adData.maxImpressionsPerDay,
        targeting: {
          categorySlug: adData.targeting?.categorySlug || '',
          productType: adData.targeting?.productType || '',
          country: adData.targeting?.country || '',
          device: adData.targeting?.device,
          pagePathPattern: adData.targeting?.pagePathPattern || '',
        },
      })
    }
  }, [isEditMode, ad, reset])

  const onSubmit = async (data: CreateAdData) => {
    console.log('Payload ==> ', data)

    // Clean up empty values
    const cleanedData = {
      ...data,
      sellerId: data.sellerId || undefined,
      customerId: data.customerId || undefined,
      startAt: data.startAt || undefined,
      endAt: data.endAt || undefined,
      maxImpressionsPerDay: data.maxImpressionsPerDay || undefined,
      targeting:
        data.targeting &&
        (data.targeting.categorySlug ||
          data.targeting.productType ||
          data.targeting.country ||
          data.targeting.device ||
          data.targeting.pagePathPattern)
          ? {
              ...(data.targeting.categorySlug && { categorySlug: data.targeting.categorySlug }),
              ...(data.targeting.productType && { productType: data.targeting.productType }),
              ...(data.targeting.country && { country: data.targeting.country }),
              ...(data.targeting.device && { device: data.targeting.device }),
              ...(data.targeting.pagePathPattern && { pagePathPattern: data.targeting.pagePathPattern }),
            }
          : undefined,
    }

    try {
      if (isEditMode) {
        await updateDataSource.mutateAsync({
          path: `/v1/ads/${adId}`,
          body: cleanedData as UpdateAdData,
        })
        showToast('Ad updated successfully!', 'success')
      } else {
        await createDataSource.mutateAsync({
          path: '/v1/ads',
          body: cleanedData,
        })
        showToast('Ad created successfully!', 'success')
      }
      router.push('/admin/ads')
    } catch (error1) {
      logger.error('Failed to save ad:', error1)
      showToast('Failed to save ad. Please try again.', 'error')
    }
  }

  if (isEditMode && isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <Icon name='AiOutlineLoading' className='mx-auto h-8 w-8 animate-spin text-primary' />
          <p className='mt-2 text-gray-600'>Loading ad details...</p>
        </div>
      </div>
    )
  }

  if (isEditMode && (error || !ad)) {
    logger.error('Failed to fetch ad:', error)
    return (
      <div className='rounded-lg bg-white p-6 shadow'>
        <div className='text-center'>
          <Icon name='AiOutlineCloseCircle' className='mx-auto h-12 w-12 text-red-500' />
          <h2 className='mt-4 text-xl font-semibold text-gray-900'>Ad Not Found</h2>
          <p className='mt-2 text-gray-600'>The ad you are looking for does not exist or has been deleted.</p>
          <Button label='Back to Ads' onClick={() => router.push('/admin/ads')} className='mt-4' />
        </div>
      </div>
    )
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
    { value: 'archived', label: 'Archived' },
  ]

  const placementKeyOptions = [
    { value: '', label: 'Select Placement' },
    { value: 'homepage_banner', label: 'Homepage Banner' },
    { value: 'homepage_sidebar', label: 'Homepage Sidebar' },
    { value: 'category_banner', label: 'Category Banner' },
    { value: 'category_sidebar', label: 'Category Sidebar' },
    { value: 'category_inline', label: 'Category Inline' },
    { value: 'product_detail_sidebar', label: 'Product Detail Sidebar' },
    { value: 'product_detail_inline', label: 'Product Detail Inline' },
    { value: 'cart_sidebar', label: 'Cart Sidebar' },
    { value: 'checkout_banner', label: 'Checkout Banner' },
  ]

  const deviceOptions = [
    { value: '', label: 'All Devices' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'tablet', label: 'Tablet' },
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            label='Back'
            icon='AiOutlineArrowLeft'
            variant='primary'
            onClick={() => router.push('/admin/ads')}
          />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{isEditMode ? 'Edit Ad' : 'Create New Ad'}</h1>
            <p className='text-gray-600'>{isEditMode ? 'Update ad information' : 'Add a new ad to the platform'}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-6'>
          {/* Basic Information */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Basic Information</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextField
                  control={control}
                  name='title'
                  label='Ad Title'
                  placeholder='Enter ad title'
                  required
                  rules={{ required: 'Title is required' }}
                />
              </GridItem>

              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextAreaField
                  control={control}
                  name='description'
                  label='Description'
                  placeholder='Enter ad description'
                  rows={3}
                />
              </GridItem>

              <GridItem>
                <SelectField
                  control={control}
                  name='placementKey'
                  label='Placement'
                  options={placementKeyOptions}
                  required
                  rules={{ required: 'Placement is required' }}
                />
              </GridItem>

              <GridItem>
                <SelectField control={control} name='status' label='Status' options={statusOptions} required />
              </GridItem>
            </Grid>
          </Card>

          {/* Media & Links */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Media & Links</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextField
                  control={control}
                  name='mediaUrl'
                  label='Media URL'
                  placeholder='https://cdn.example.com/ads/banner.jpg'
                  required
                  rules={{
                    required: 'Media URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Please enter a valid URL',
                    },
                  }}
                />
              </GridItem>

              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextField
                  control={control}
                  name='linkUrl'
                  label='Link URL'
                  placeholder='https://example.com/destination'
                  required
                  rules={{
                    required: 'Link URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Please enter a valid URL',
                    },
                  }}
                />
              </GridItem>
            </Grid>
          </Card>

          {/* Owner Information */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Owner Information</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <SelectField control={control} name='sellerId' label='Seller' options={sellerOptions} />
              </GridItem>

              <GridItem>
                <SelectField control={control} name='customerId' label='Customer' options={customerOptions} />
              </GridItem>
            </Grid>
            <p className='mt-2 text-sm text-gray-500'>
              Leave both empty for platform ads. Select either a seller or customer, not both.
            </p>
          </Card>

          {/* Schedule & Performance */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Schedule & Performance</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField
                  control={control}
                  name='startAt'
                  label='Start Date'
                  type='datetime-local'
                  placeholder='Select start date and time'
                />
              </GridItem>

              <GridItem>
                <TextField
                  control={control}
                  name='endAt'
                  label='End Date'
                  type='datetime-local'
                  placeholder='Select end date and time'
                />
              </GridItem>

              <GridItem>
                <TextField
                  control={control}
                  name='weight'
                  label='Weight'
                  type='number'
                  placeholder='1'
                  rules={{
                    min: { value: 1, message: 'Weight must be at least 1' },
                  }}
                />
                <p className='mt-1 text-sm text-gray-500'>Higher weight = more likely to be shown</p>
              </GridItem>

              <GridItem>
                <TextField
                  control={control}
                  name='maxImpressionsPerDay'
                  label='Max Impressions/Day'
                  type='number'
                  placeholder='Leave empty for unlimited'
                  rules={{
                    min: { value: 1, message: 'Must be at least 1' },
                  }}
                />
              </GridItem>
            </Grid>
          </Card>

          {/* Targeting */}
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Targeting (Optional)</h3>
            <Grid col={{ default: 1, md: 2 }} rowGap={4} colGap={4}>
              <GridItem>
                <TextField
                  control={control}
                  name='targeting.categorySlug'
                  label='Category Slug'
                  placeholder='electronics'
                />
              </GridItem>

              <GridItem>
                <TextField
                  control={control}
                  name='targeting.productType'
                  label='Product Type'
                  placeholder='laptop'
                />
              </GridItem>

              <GridItem>
                <TextField control={control} name='targeting.country' label='Country Code' placeholder='US' />
              </GridItem>

              <GridItem>
                <SelectField control={control} name='targeting.device' label='Device' options={deviceOptions} />
              </GridItem>

              <GridItem colSpan={{ default: 1, md: 2 }}>
                <TextField
                  control={control}
                  name='targeting.pagePathPattern'
                  label='Page Path Pattern (Regex)'
                  placeholder='^/c/.*'
                />
              </GridItem>
            </Grid>
            <p className='mt-2 text-sm text-gray-500'>
              Leave empty to target all. Fill only the fields you want to target.
            </p>
          </Card>

          {/* Actions */}
          <Card>
            <div className='flex justify-end gap-4'>
              <Button
                type='button'
                label='Cancel'
                variant='danger'
                onClick={() => router.push('/admin/ads')}
                disabled={isSubmitting}
              />
              <Button
                type='submit'
                label={isEditMode ? 'Update Ad' : 'Create Ad'}
                variant='primary'
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
}
