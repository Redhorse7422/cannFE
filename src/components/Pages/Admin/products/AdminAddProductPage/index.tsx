'use client'

import type { FileWithPreview } from '@/components/FormElements/UploadInput/EnhancedUploadInput'

import React from 'react'

import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from './sections/SectionAction'
import SectionBasicInfo from './sections/SectionBasicInfo'
import SectionMedia from './sections/SectionMedia'
import SectionPricingStock from './sections/SectionPricingStock'
import SectionSEOExternal from './sections/SectionSEOExternal'
import SectionStats from './sections/SectionStats'
import SectionTaxShipping from './sections/SectionTaxShipping'
import SectionVariations from './sections/SectionVariations'

export const defaultValues: NewProductForm = {
  name: '',
  slug: '',
  categoryIds: [],
  tags: '',
  shortDescription: '',
  longDescription: '',
  regularPrice: 0,
  salePrice: 0,
  isVariant: false,
  published: false,
  approved: false,
  stock: 0,
  cashOnDelivery: false,
  featured: false,
  discount: 0,
  discountType: 'percent',
  discountStartDate: '',
  discountEndDate: '',
  discountEnabled: false,
  tax: 0,
  taxType: 'percent',
  shippingType: 'free',
  shippingCost: 0,
  estShippingDays: 0,
  numOfSales: 0,
  metaTitle: '',
  metaDescription: '',
  rating: 0,
  externalLink: '',
  externalLinkBtn: '',
  thumbnailImg: [],
  photos: [],
  variations: [],
  sellerId: '',
  productType: 'service',
  canBePurchased: false,
}

export type ProductVariation = {
  name: string
  variant: string
  sku: string
  price: number
  quantity: number
  imageBase64: FileWithPreview[]
}

export type NewProductForm = {
  name: string
  slug: string
  categoryIds: string[]
  tags: string
  shortDescription: string
  longDescription: string
  regularPrice: number
  salePrice: number
  isVariant: boolean
  published: boolean
  approved: boolean
  stock: number
  cashOnDelivery: boolean
  featured: boolean
  discount: number
  discountType: 'percent' | 'amount'
  discountStartDate: string
  discountEndDate: string
  discountEnabled: boolean
  tax: number
  taxType: 'percent' | 'amount'
  shippingType: 'free' | 'paid'
  shippingCost: number
  estShippingDays: number
  numOfSales: number
  metaTitle: string
  metaDescription: string
  rating: number
  externalLink: string
  externalLinkBtn: string
  thumbnailImg: FileWithPreview[]
  photos: FileWithPreview[]
  variations: ProductVariation[]
  sellerId: string
  productType: string
  canBePurchased: boolean
}

export const AdminAddProductPage: React.FC = () => {
  const methods = useForm<NewProductForm>({
    defaultValues,
  })

  const router = useRouter()
  const { showToast } = useToast()
  const { createDataSource } = useApi()
  const fullLoading = useFullScreenLoading()
  const productType = methods.watch('productType')

  const handleOnSubmit = async (data: NewProductForm) => {
    try {
      fullLoading.open()

      // Validate variations before submission
      if (data.variations && Array.isArray(data.variations) && data.variations.length > 0) {
        for (let i = 0; i < data.variations.length; i++) {
          const variation = data.variations[i]

          if (!variation.variant || variation.variant.trim() === '') {
            showToast(`Variation ${i + 1}: Variant name is required`, 'error')
            fullLoading.close()
            return
          }

          if (!variation.sku || variation.sku.trim() === '') {
            showToast(`Variation ${i + 1}: SKU is required`, 'error')
            fullLoading.close()
            return
          }

          if (!variation.price || variation.price <= 0) {
            showToast(`Variation ${i + 1}: Price must be greater than 0`, 'error')
            fullLoading.close()
            return
          }

          if (variation.quantity === undefined || variation.quantity < 0) {
            showToast(`Variation ${i + 1}: Quantity must be 0 or greater`, 'error')
            fullLoading.close()
            return
          }
        }
      }

      // Prepare simple payload
      const payload = {
        name: data.name,
        slug: data.slug,
        categoryIds: data.categoryIds,
        sellerId: data.sellerId,
        tags: data.tags,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        regularPrice: data.regularPrice,
        salePrice: data.salePrice,
        isVariant: data.isVariant,
        published: data.published,
        approved: data.approved,
        stock: data.stock,
        cashOnDelivery: data.cashOnDelivery,
        featured: data.featured,
        discount: data.discount,
        discountType: data.discountType,
        ...(data.discountEnabled && {
          discountStartDate: data.discountStartDate,
          discountEndDate: data.discountEndDate,
        }),
        tax: data.tax,
        taxType: data.taxType,
        shippingType: data.shippingType,
        shippingCost: data.shippingCost,
        estShippingDays: data.estShippingDays,
        numOfSales: data.numOfSales,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        rating: data.rating,
        externalLink: data.externalLink,
        externalLinkBtn: data.externalLinkBtn,
        // Handle file uploads separately or convert to base64 if needed
        thumbnailImgId: data.thumbnailImg.length > 0 ? data.thumbnailImg[0].fileId : null,
        photosIds: data.photos.map((file) => file.fileId),
        variations: data.variations.map((variation) => ({
          name: variation.name,
          variant: variation.variant,
          sku: variation.sku,
          price: variation.price,
          quantity: variation.quantity,
          imageId: variation.imageBase64.length > 0 ? variation.imageBase64[0] : null,
        })),
        canBePurchased: data.canBePurchased,
        productType: data.productType,
      }

      await createDataSource.mutateAsync({
        path: '/v1/products/store',
        body: payload,
      })
      showToast('Product Created successfully!', 'success')
      router.push('/products')
    } catch (error) {
      console.error('Error creating product:', error)
      showToast('An error occurred while creating the product!', 'error')
    } finally {
      fullLoading.close()
    }
  }

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col gap-y-6' onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <SectionBasicInfo control={methods.control} />
        <SectionPricingStock control={methods.control} />
        <SectionTaxShipping control={methods.control} />
        {productType === 'product' && <SectionMedia control={methods.control} />}
        <SectionVariations control={methods.control} />
        <SectionSEOExternal control={methods.control} />
        <SectionStats control={methods.control} />
        <SectionAction />
      </form>
    </FormProvider>
  )
}

export default AdminAddProductPage
