'use client'

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { AdminEDIUploadPage } from '@/components/Pages/Admin/edi/AdminEDIUploadPage'

export default function Page() {
  return (
    <>
      <Breadcrumb pageName='EDI Upload' />
      <AdminEDIUploadPage />
    </>
  )
}

