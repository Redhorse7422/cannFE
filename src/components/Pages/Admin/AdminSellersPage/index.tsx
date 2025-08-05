'use client'

import { SectionFilter } from './SectionFilter'
import { SectionSellers } from './SectionSellers'
import { SellerFilterProvider } from './SellerFilterContext'

export const AdminSellersPage = () => {
  return (
    <SellerFilterProvider>
      <div className='flex flex-col gap-y-6'>
        <SectionFilter />
        <SectionSellers />
      </div>
    </SellerFilterProvider>
  )
}
