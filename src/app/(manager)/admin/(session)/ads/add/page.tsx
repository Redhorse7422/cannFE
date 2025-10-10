'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminAdFormPage } from '@/components/Pages/Admin/ads/AdminAdFormPage'

export default function AdCreatePage() {
  return (
    <>
      <Breadcrumb pageName='Create Ad' />
      <AdminAdFormPage />
    </>
  )
}
