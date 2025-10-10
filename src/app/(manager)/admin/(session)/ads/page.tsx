'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminAdsPage } from '@/components/Pages/Admin/ads/AdminAdsPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='Ads' />
      <AdminAdsPage />
    </>
  )
}
