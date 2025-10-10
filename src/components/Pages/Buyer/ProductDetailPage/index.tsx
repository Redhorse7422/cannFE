'use client'

import type { AddToCartDto, CartVariantDto } from '@/services/cart.services'
import type { ProductDetail, ProductImage } from '@/types/product'

import React, { useState } from 'react'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import RichTextViewer from '@/components/common/RichTextViewer'
import { useCart } from '@/contexts/CartContext'
import useToast from '@/hooks/useToast'
// import sanitizeHtml from '@/utils/sanitize-html'

import { ProductGallery } from './components/ProductGallery'
import { ProductInfo } from './components/ProductInfo'
import { ProductTabs } from './components/ProductTabs'

interface ProductDetailPageProps {
  product: ProductDetail
  isLoading: boolean
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, isLoading = false }) => {
  const { cart, addItem, setUpdating } = useCart()
  const { showToast } = useToast()

  // Select the first available variation (with stock > 0) or the first variation if none have stock
  const getDefaultVariation = () => {
    if (product.variations && product.variations.length > 0) {
      const availableVariation = product.variations.find((v) => v.quantity > 0)
      return availableVariation || product.variations[0]
    }
    return null
  }

  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedVariation, setSelectedVariation] = useState(getDefaultVariation())
  const [mainImage, setMainImage] = useState(product.thumbnailImg?.url || '')
  const [activeTab, setActiveTab] = useState('description')

  // Get all images from variations and thumbnail
  const getAllImages = (): ProductImage[] => {
    const images: ProductImage[] = []

    // Add thumbnail image if it exists
    if (product.thumbnailImg?.url) {
      images.push({
        id: product.thumbnailImg.id,
        url: product.thumbnailImg.url,
        alt: product.name,
        isMain: true,
      })
    }

    // Add variation images
    if (product.variations) {
      product.variations.forEach((variation) => {
        const image = variation.image
        if (image?.url && image?.id && !images.find((img) => img.id === image.id)) {
          images.push({
            id: image.id,
            url: image.url,
            alt: `${product.name} - ${variation.attributeValue}`,
            isMain: false,
          })
        }
      })
    }

    return images
  }

  const images = getAllImages()

  const handleImageChange = (image: ProductImage) => {
    setMainImage(image.url)
  }

  const handleQuantityChange = (quantity: number) => {
    // Get current stock based on selected variation or product stock
    const getCurrentStock = () => {
      if (product.isVariant && product.variations && product.variations.length > 0) {
        if (selectedVariation) {
          return selectedVariation.quantity
        }
        return product.variations.some((v) => v.quantity > 0) ? 1 : 0
      }
      return product.stock
    }

    const maxQuantity = getCurrentStock() || 1
    setSelectedQuantity(Math.max(1, Math.min(quantity, maxQuantity)))
  }

  const handleVariationChange = (variation: any) => {
    setSelectedVariation(variation)
    setSelectedQuantity(1) // Reset quantity when variation changes
  }

  const handleAddToCart = async () => {
    try {
      setUpdating(true)

      const currentStock = selectedVariation?.quantity || product.stock
      if (currentStock <= 0) {
        showToast('Product is out of stock', 'error')
        return
      }

      if (selectedQuantity <= 0) {
        showToast('Please select a quantity', 'error')
        return
      }

      if (selectedQuantity > currentStock) {
        showToast(`Only ${currentStock} items available`, 'error')
        return
      }

      if (product.isVariant && product.variations && product.variations.length > 0 && !selectedVariation) {
        showToast('Please select a variation', 'error')
        return
      }

      // Build variants array for DTO if applicable
      let variants: CartVariantDto[] | undefined = undefined
      if (selectedVariation) {
        variants = [
          {
            // Backend expects attributeId and attributeValueId; use id and sku as closest available fields
            attributeId: selectedVariation.attributeId || '',
            attributeValueId: selectedVariation.attributeValueId || '',
            attributeName: selectedVariation.attributeName,
            attributeValue: selectedVariation.attributeValue,
          },
        ]
      }

      const salePrice = parseFloat(product.salePrice)
      const regularPrice = parseFloat(product.regularPrice)

      const finalPrice = selectedVariation?.price
        ? parseFloat(selectedVariation.price)
        : salePrice > 0
          ? salePrice
          : regularPrice

      const dto: AddToCartDto = {
        productId: product.id,
        quantity: selectedQuantity,
        price: finalPrice,
        variants,
      }

      await addItem(dto)
      const variationText = selectedVariation ? ` (${selectedVariation.attributeValue})` : ''
      showToast(`${product.name}${variationText} added to cart!`, 'success')
      setSelectedQuantity(1)
    } catch (error) {
      console.error('Error adding to cart:', error)
      showToast('Failed to add item to cart', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist logic
    console.log('Adding to wishlist:', product.name)
  }

  const handleShare = () => {
    // TODO: Implement share logic
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 py-8'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='animate-pulse'>
            <div className='mb-8 h-4 w-1/4 rounded bg-gray-200'></div>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              <div className='h-96 rounded bg-gray-200'></div>
              <div className='space-y-4'>
                <div className='h-8 w-3/4 rounded bg-gray-200'></div>
                <div className='h-4 w-1/2 rounded bg-gray-200'></div>
                <div className='h-4 w-1/3 rounded bg-gray-200'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const isService = product.productType === 'service' || !product.canBePurchased

  if (isService) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='border-b bg-white'>
          <div className='mx-auto max-w-7xl px-4 py-6 pb-0 sm:px-6 lg:px-8'>
            <Breadcrumb pageName={product.name} />
          </div>
        </div>
        <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8'>
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <h1 className='mb-4 text-2xl font-bold text-gray-900'>{product.name}</h1>
            {product.shortDescription && <p className='mb-6 text-gray-600'>{product.shortDescription}</p>}
            {/* <div
              className='prose max-w-none text-gray-800'
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.longDescription || '') }}
            /> */}
            <RichTextViewer html={product.longDescription || ''} className='prose max-w-none text-gray-800' />
            {product.externalLink && (
              <div className='mt-6'>
                <a
                  href={product.externalLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:opacity-90'
                >
                  {product.externalLinkBtn || 'Learn More'}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='border-b bg-white'>
        <div className='mx-auto max-w-7xl px-4 py-6 pb-0 sm:px-6 lg:px-8'>
          <Breadcrumb pageName={product.name} />
        </div>
      </div>

      {/* Main Product Section */}
      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-12 lg:grid-cols-2'>
          {/* Product Gallery */}
          <ProductGallery images={images} mainImage={mainImage} onImageChange={handleImageChange} />

          {/* Product Info */}
          <ProductInfo
            product={product}
            selectedQuantity={selectedQuantity}
            selectedVariation={selectedVariation}
            onQuantityChange={handleQuantityChange}
            onVariationChange={handleVariationChange}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            onShare={handleShare}
            isLoading={cart.isUpdating}
          />
        </div>

        {/* Product Tabs */}
        <div className='mt-16'>
          <ProductTabs product={product} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Related Products */}
        {/* <div className='mt-16'>
          <RelatedProducts products={product.relatedProducts} />
        </div> */}
      </div>
    </div>
  )
}
