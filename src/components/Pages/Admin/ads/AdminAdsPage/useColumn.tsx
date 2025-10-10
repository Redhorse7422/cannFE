'use client'

import type { TableProps } from '@/components/ui/paginated-table/type'
import type { Ad } from '@/types/ad'

import { useState } from 'react'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Flex } from '@/components/common/Flex'
import DeleteConfirmationModal from '@/components/common/Modal/DeleteConfirmationModal'
import { Icon } from '@/components/common/icon'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'

export const useColumn = (refetch?: () => void) => {
  const router = useRouter()
  const { removeDataSource } = useApi()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()

  const openDeleteModal = (id: string) => {
    setSelectedId(id)
    setIsModalOpen(true)
  }

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!selectedId) return

    try {
      await removeDataSource.mutateAsync({
        path: '/v1/ads',
        id: selectedId,
      })
      showToast('Ad deleted successfully!', 'success')
      refetch?.()
    } catch (error) {
      logger.error('Failed to delete ad:', error)
      showToast('Failed to delete ad. Please try again.', 'error')
    } finally {
      closeModal()
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedId(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
      archived: { color: 'bg-red-100 text-red-800', label: 'Archived' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: status,
    }
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const columns: TableProps['columns'] = [
    {
      header: 'Ad',
      key: 'title',
      isSort: true,
      render: (_: string, item: Ad) => {
        const title = item?.title || 'Untitled Ad'
        const placementKey = item?.placementKey || 'N/A'

        return (
          <Flex align='center' gap='small'>
            <div className='relative h-12 w-12 overflow-hidden rounded'>
              <Image
                src={item?.mediaUrl || '/images/no-image.png'}
                width={48}
                height={48}
                alt={title}
                className='object-cover'
              />
            </div>
            <div className='flex flex-col'>
              <span className='font-medium text-gray-900'>{title}</span>
              <span className='text-sm text-gray-500'>{placementKey}</span>
            </div>
          </Flex>
        )
      },
    },
    {
      header: 'Status',
      key: 'status',
      isSort: true,
      render: (status: string) => getStatusBadge(status),
    },
    {
      header: 'Owner',
      key: 'sellerId',
      render: (_: string, item: Ad) => {
        if (item?.seller) {
          return (
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-900'>{item.seller.businessName}</span>
              <span className='text-xs text-gray-500'>Seller</span>
            </div>
          )
        }
        if (item?.customer) {
          return (
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-900'>
                {item.customer.firstName} {item.customer.lastName}
              </span>
              <span className='text-xs text-gray-500'>Customer</span>
            </div>
          )
        }
        return <span className='text-sm text-gray-500'>Platform</span>
      },
    },
    {
      header: 'Schedule',
      key: 'startAt',
      isSort: true,
      render: (_: string, item: Ad) => {
        const startAt = item?.startAt ? new Date(item.startAt).toLocaleDateString() : 'Immediate'
        const endAt = item?.endAt ? new Date(item.endAt).toLocaleDateString() : 'No expiry'
        return (
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>{startAt}</span>
            <span className='text-xs text-gray-500'>to {endAt}</span>
          </div>
        )
      },
    },
    {
      header: 'Performance',
      key: 'totalImpressions',
      isSort: true,
      render: (_: string, item: Ad) => {
        const impressions = item?.totalImpressions || 0
        const maxImpressions = item?.maxImpressionsPerDay || '∞'
        return (
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>{impressions.toLocaleString()} views</span>
            <span className='text-xs text-gray-500'>Max: {maxImpressions}/day</span>
          </div>
        )
      },
    },
    {
      header: 'Weight',
      key: 'weight',
      isSort: true,
      render: (weight: number) => {
        return <span className='text-sm font-medium text-gray-900'>{weight}</span>
      },
    },
    {
      header: 'Created',
      key: 'createdAt',
      isSort: true,
      render: (date: string) => {
        return (
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>{new Date(date).toLocaleDateString()}</span>
            <span className='text-xs text-gray-500'>{new Date(date).toLocaleTimeString()}</span>
          </div>
        )
      },
    },
    {
      header: 'Actions',
      key: 'action',
      className: 'w-[200px] text-right',
      render: (_: unknown, record: Ad) => (
        <div className='flex justify-end gap-2'>
          <button
            className='rounded px-2 py-2 text-warning hover:bg-gray-100'
            onClick={() => router.push(`/admin/ads/${record.id}/edit`)}
            aria-label={`Edit ${record.title}`}
          >
            <Icon name='AiOutlineEdit' color='warning' size='lg' />
          </button>
          <button
            className='rounded px-2 py-2 text-danger hover:bg-gray-100'
            onClick={() => openDeleteModal(record.id)}
            aria-label={`Delete ${record.title}`}
          >
            <Icon name='AiOutlineDelete' color='danger' size='lg' />
          </button>
        </div>
      ),
    },
  ]

  return {
    columns,
    modal: (
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title='Delete Ad'
        description='Are you sure you want to delete this ad? This action cannot be undone.'
      />
    ),
  }
}
