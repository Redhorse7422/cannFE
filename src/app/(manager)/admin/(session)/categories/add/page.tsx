'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminAddCategoryPage } from '@/components/Pages/Admin/category/AdminAddCategoryPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='New Category' />
      <AdminAddCategoryPage />
    </>
  )
}
