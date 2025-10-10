'use client'

import React, { useState, useCallback, useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { MiniCart } from '@/components/Pages/Buyer/CartPage/components/MiniCart'
import { Icon } from '@/components/common/icon'
import { useCart } from '@/contexts/CartContext'

export const CartIcon: React.FC = React.memo(() => {
  const { cart, updateQuantity, removeItem } = useCart()
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false)
  const router = useRouter()

  const handleOpenMiniCart = useCallback(() => {
    setIsMiniCartOpen(true)
  }, [])

  const handleCloseMiniCart = useCallback(() => {
    setIsMiniCartOpen(false)
  }, [])

  const handleViewCart = useCallback(() => {
    setIsMiniCartOpen(false)
    router.push('/cart')
  }, [router])

  const handleCheckout = useCallback(() => {
    setIsMiniCartOpen(false)
    router.push('/checkout')
  }, [router])

  const handleUpdateQuantity = useCallback(async (itemId: string, quantity: number) => {
    await updateQuantity(itemId, quantity)
  }, [updateQuantity])

  const handleRemoveItem = useCallback(async (itemId: string) => {
    await removeItem(itemId)
  }, [removeItem])

  // Memoize the cart item count to prevent unnecessary re-renders
  const itemCount = useMemo(() => {
    return cart.summary.itemCount > 0 ? (cart.summary.itemCount > 99 ? '99+' : cart.summary.itemCount) : null
  }, [cart.summary.itemCount])

  return (
    <>
      <button
        onClick={handleOpenMiniCart}
        className='relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      >
        <Icon name='AiOutlineShopping' className='h-6 w-6' />
        {itemCount && (
          <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white'>
            {itemCount}
          </span>
        )}
      </button>

      <MiniCart
        cart={cart}
        isOpen={isMiniCartOpen}
        onClose={handleCloseMiniCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onViewCart={handleViewCart}
        onCheckout={handleCheckout}
      />
    </>
  )
})

CartIcon.displayName = 'CartIcon'
