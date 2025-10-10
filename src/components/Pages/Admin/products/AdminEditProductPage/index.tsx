'use client'

import type { FileWithPreview } from '@/components/FormElements/UploadInput/EnhancedUploadInput'
import type { Category } from '@/types/common'

import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from '../AdminAddProductPage/sections/SectionAction'
import SectionBasicInfo from '../AdminAddProductPage/sections/SectionBasicInfo'
import SectionMedia from '../AdminAddProductPage/sections/SectionMedia'
import SectionPricingStock from '../AdminAddProductPage/sections/SectionPricingStock'
import SectionSEOExternal from '../AdminAddProductPage/sections/SectionSEOExternal'
import SectionStats from '../AdminAddProductPage/sections/SectionStats'
import SectionTaxShipping from '../AdminAddProductPage/sections/SectionTaxShipping'
import SectionVariations from '../AdminAddProductPage/sections/SectionVariations'

const defaultValues: NewProductForm = {
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
  id?: string
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

export const AdminEditProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { showToast } = useToast()
  const fullLoading = useFullScreenLoading()
  const { getDataSourceById, updateDataSource } = useApi()

  const {
    data: product,
    isLoading,
    status,
  } = getDataSourceById({
    path: '/v1/products',
    id,
    enabled: !!id,
  })

  const methods = useForm<NewProductForm>({
    defaultValues,
  })
  const productType = methods.watch('productType')

  const { setValue } = methods

  useEffect(() => {
    if (isLoading && status === 'pending' && !product) {
      fullLoading.open()
    } else {
      fullLoading.close()
      if (product && typeof product === 'object') {
        // Set basic info
        setValue('name', (product as any).name ?? '')
        setValue('slug', (product as any).slug ?? '')
        setValue('categoryIds', (product as any).categories.map((item: Category) => item.id) ?? [])
        setValue('tags', (product as any).tags ?? '')
        setValue('sellerId', (product as any).seller ? (product as any).seller.id : '')
        setValue('shortDescription', (product as any).shortDescription ?? '')
        setValue('longDescription', (product as any).longDescription ?? '')
        setValue('productType', (product as any).productType ?? 'service')
        setValue('canBePurchased', (product as any).canBePurchased ?? false)

        // Set pricing and stock
        setValue('regularPrice', (product as any).regularPrice ?? 0)
        setValue('salePrice', (product as any).salePrice ?? 0)
        setValue('stock', (product as any).stock ?? 0)
        setValue('isVariant', (product as any).isVariant ?? false)
        setValue('published', (product as any).published ?? false)
        setValue('approved', (product as any).approved ?? false)
        setValue('cashOnDelivery', (product as any).cashOnDelivery ?? false)
        setValue('featured', (product as any).featured ?? false)

        // Set discount info
        setValue('discount', (product as any).discount ?? 0)
        setValue('discountType', (product as any).discountType ?? 'percent')
        setValue('discountStartDate', (product as any).discountStartDate ?? '')
        setValue('discountEndDate', (product as any).discountEndDate ?? '')

        // Set tax and shipping
        setValue('tax', (product as any).tax ?? 0)
        setValue('taxType', (product as any).taxType ?? 'percent')
        setValue('shippingType', (product as any).shippingType ?? 'free')
        setValue('shippingCost', (product as any).shippingCost ?? 0)
        setValue('estShippingDays', (product as any).estShippingDays ?? 0)

        // Set stats
        setValue('numOfSales', (product as any).numOfSales ?? 0)
        setValue('rating', (product as any).rating ?? 0)

        // Set SEO and external
        setValue('metaTitle', (product as any).metaTitle ?? '')
        setValue('metaDescription', (product as any).metaDescription ?? '')
        setValue('externalLink', (product as any).externalLink ?? '')
        setValue('externalLinkBtn', (product as any).externalLinkBtn ?? '')

        // Set images
        setValue('thumbnailImg', product.thumbnailImg ? [(product as any).thumbnailImg] : [])

        setValue('photos', (product as any).photos?.length > 0 ? (product as any).photos : [])

        // Set variations
        if ((product as any).variations && Array.isArray((product as any).variations)) {
          const variationFiles: ProductVariation[] = (product as any).variations.map(
            (variation: any, index: number) => ({
              id: variation.id || `existing-variation-${index}`,
              name: variation.name || '',
              variant: variation.variant || '',
              sku: variation.sku || '',
              price: variation.price || 0,
              quantity: variation.quantity || 0,
              imageBase64: variation.image ? [(variation as any).image] : [],
            }),
          )
          setValue('variations', variationFiles)
        } else {
          setValue('variations', [])
        }
      }
    }
  }, [product, isLoading, status, setValue])

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
        thumbnailImgId: data.thumbnailImg.length > 0 ? (data.thumbnailImg[0].fileId ?? data.thumbnailImg[0].id) : null,
        photosIds: data.photos.map((file) => (file.fileId ? file.fileId : file.id)),
        variations: data.variations.map((variation) => ({
          name: variation.name,
          variant: variation.variant,
          sku: variation.sku,
          price: variation.price,
          quantity: variation.quantity,
          imageId:
            variation.imageBase64.length > 0
              ? variation.imageBase64[0].id
                ? variation.imageBase64[0].id
                : variation.imageBase64[0]
              : null,
        })),
        canBePurchased: data.canBePurchased,
        productType: data.productType,
      }

      await updateDataSource.mutateAsync({
        path: `/v1/products/update/${id}`,
        body: payload,
      })
      showToast('Product Updated successfully!', 'success')
      router.push('/products')
    } catch (error) {
      console.error('Error updating product:', error)
      showToast('An error occurred while updating the product!', 'error')
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
        <SectionAction updating />
      </form>
    </FormProvider>
  )
}

export default AdminEditProductPage
