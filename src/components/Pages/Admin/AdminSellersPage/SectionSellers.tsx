'use client'

import type { SmartColumn } from '@/components/ui/smart-paginated-table/types'

import { useRef } from 'react'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { SmartPaginatedTable } from '@/components/ui/smart-paginated-table'

import { useColumn } from './useColumn'

export const SectionSellers = () => {
  const tableRef = useRef<{ refetch: () => void }>(null)
  const { columns, modal } = useColumn(() => tableRef.current?.refetch())
  const router = useRouter()

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <p className='text-lg font-semibold'>Sellers</p>
        <div className='flex gap-3'>
          <Button
            icon='AiOutlinePlus'
            label='Add Seller'
            variant='outlinePrimary'
            onClick={() => router.push('/sellers/create')}
          />
        </div>
      </div>
      <SmartPaginatedTable
        ref={tableRef}
        path='/v1/sellers'
        columns={columns as SmartColumn[]}
        initialQuery={{
          sort: '-createdAt',
          includeUser: 'true',
        }}
      />
      {modal}
    </>
  )
}
