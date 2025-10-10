'use client'

import type { ProductInfoProps } from '@/types/product'

import React from 'react'

import { StarIcon, HeartIcon } from '@/assets/icons'
import { Icon } from '@/components/common/icon'

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedQuantity,
  selectedVariation,
  onQuantityChange,
  onVariationChange,
  onAddToCart,
  onAddToWishlist,
  onShare,
  isLoading = false,
}) => {
  const handleQuantityIncrement = () => {
    onQuantityChange(selectedQuantity + 1)
  }

  const handleQuantityDecrement = () => {
    onQuantityChange(selectedQuantity - 1)
  }

  const handleVariantChange = (variation: any) => {
    if (onVariationChange) {
      onVariationChange(variation)
    }
  }

  const getCurrentPrice = () => {
    if (selectedVariation) {
      return parseFloat(selectedVariation.price)
    }
    return parseFloat(product.regularPrice)
  }

  const getSalePrice = () => {
    if (product.salePrice && parseFloat(product.salePrice) > 0) {
      return parseFloat(product.salePrice)
    }
    return null
  }

  const getAvailabilityText = () => {
    const currentStock = getCurrentStock()
    if (currentStock > 10) {
      return { text: 'In Stock', color: 'text-green-600' }
    }
    if (currentStock > 0) {
      return { text: 'Low Stock', color: 'text-orange-600' }
    }
    return { text: 'Out of Stock', color: 'text-red-600' }
  }

  const getCurrentStock = () => {
    if (product.isVariant && product.variations && product.variations.length > 0) {
      // For variant products, check selected variation or total stock across all variants
      if (selectedVariation) {
        return selectedVariation.quantity
      }
      // If no variation selected, check if any variant has stock
      return product.variations.some((v) => v.quantity > 0) ? 1 : 0
    }
    return product.stock
  }

  const isOutOfStock = () => {
    const currentStock = getCurrentStock()
    return currentStock <= 0
  }

  const availability = getAvailabilityText()
  const currentPrice = getCurrentPrice()
  const salePrice = getSalePrice()
  const isOnSale = salePrice !== null && salePrice < currentPrice

  return (
    <div className='space-y-6'>
      {/* Product Title and Badge */}
      <div>
        {product.featured && (
          <span className='mb-2 inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white'>
            Featured
          </span>
        )}
        <h1 className='mb-2 text-3xl font-bold text-gray-900'>{product.name}</h1>
        <p className='text-lg text-gray-600'>{product.shortDescription}</p>
      </div>

      {/* Rating and Reviews */}
      {/* <div className='flex items-center space-x-4'>
        <div className='flex items-center'>
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${i < Math.floor(parseFloat(product.rating)) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className='ml-2 text-sm text-gray-600'>{product.rating}</span>
        </div>
        <span className='text-sm text-gray-500'>({product.numOfSales} sales)</span>
        <span className={`text-sm font-medium ${availability.color}`}>{availability.text}</span>
      </div> */}

      {/* Price */}
      <div className='space-y-2'>
        <div className='flex items-center space-x-3'>
          <span className='text-3xl font-bold text-gray-900'>
            ${isOnSale ? salePrice.toFixed(2) : currentPrice.toFixed(2)}
          </span>
          {isOnSale && (
            <>
              <span className='text-xl text-gray-500 line-through'>${currentPrice?.toFixed(2)}</span>
              <span className='rounded-full bg-red-100 px-2 py-1 text-sm font-semibold text-red-600'>
                -{Math.round(((currentPrice - salePrice!) / currentPrice) * 100)}%
              </span>
            </>
          )}
        </div>
        {product.discount && parseFloat(product.discount) > 0 && (
          <p className='text-sm text-gray-600'>
            {product.discountType === 'percent' ? `${product.discount}% off` : `$${product.discount} off`}
          </p>
        )}
      </div>

      {/* Categories */}
      {product.categories && product.categories.length > 0 && (
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-gray-900'>Categories</h3>
          <div className='flex flex-wrap gap-2'>
            {product.categories.map((category) => (
              <span key={category.id} className='rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700'>
                {category.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Variations */}
      {product.variations && product.variations.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-sm font-medium text-gray-900'>Size</h3>
          <div className='flex space-x-3'>
            {product.variations.map((variation) => (
              <button
                key={variation.sku}
                onClick={() => handleVariantChange(variation)}
                disabled={variation.quantity <= 0}
                className={`relative rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                  selectedVariation?.sku === variation.sku
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-gray-300'
                } ${variation.quantity <= 0 ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {variation.attributeValue}
                {variation.quantity <= 0 && (
                  <span className='absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500'></span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium text-gray-900'>Quantity</h3>
        <div className='flex items-center space-x-3'>
          <button
            onClick={handleQuantityDecrement}
            disabled={selectedQuantity <= 1}
            className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Icon name='AiOutlineMinus' className='h-4 w-4' />
          </button>
          <span className='w-16 text-center text-lg font-medium'>{selectedQuantity}</span>
          <button
            onClick={handleQuantityIncrement}
            disabled={selectedQuantity >= getCurrentStock()}
            className='rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <Icon name='AiOutlinePlus' className='h-4 w-4' />
          </button>
          <span className='text-sm text-gray-500'>{getCurrentStock()} available</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='space-y-3'>
        <button
          onClick={onAddToCart}
          disabled={isOutOfStock() || isLoading}
          className='w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? (
            <div className='flex items-center justify-center'>
              <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
              Adding...
            </div>
          ) : isOutOfStock() ? (
            'Out of Stock'
          ) : (
            'Add to Cart'
          )}
        </button>
      </div>

      {/* Product Details */}
      {/* <div className='space-y-4 border-t pt-6'>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-medium text-gray-900'>SKU:</span>
            <span className='ml-2 text-gray-600'>{selectedVariation?.sku || 'N/A'}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Stock:</span>
            <span className='ml-2 text-gray-600'>{getCurrentStock()}</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Shipping:</span>
            <span className='ml-2 text-gray-600'>Calculated at checkout</span>
          </div>
          <div>
            <span className='font-medium text-gray-900'>Delivery:</span>
            <span className='ml-2 text-gray-600'>
              {product.estShippingDays > 0 ? `${product.estShippingDays} days` : 'Same day'}
            </span>
          </div>
        </div>
      </div> */}

      {/* Shipping Info */}
      <div className='rounded-lg bg-gray-50 p-4'>
        <h3 className='mb-2 font-medium text-gray-900'>Shipping Information</h3>
        <p className='text-sm text-gray-600'>
          Shipping cost calculated at checkout based on your location and selected method
          {product.cashOnDelivery && ' • Cash on delivery available'}
        </p>
      </div>
    </div>
  )
}
