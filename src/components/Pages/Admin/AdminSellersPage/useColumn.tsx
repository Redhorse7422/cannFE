'use client'

import type { TableProps } from '@/components/ui/paginated-table/type'
import type { Seller } from '@/types/seller'

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
        path: '/v1/sellers',
        id: selectedId,
      })
      showToast('Seller deleted successfully!', 'success')
      refetch?.()
    } catch (error) {
      logger.error('Failed to delete seller:', error)
      showToast('Failed to delete seller. Please try again.', 'error')
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
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
      suspended: { color: 'bg-orange-100 text-orange-800', label: 'Suspended' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
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

  const getVerificationStatusBadge = (status: string) => {
    const statusConfig = {
      unverified: { color: 'bg-gray-100 text-gray-800', label: 'Unverified' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      verified: { color: 'bg-green-100 text-green-800', label: 'Verified' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
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
      header: 'Business',
      key: 'businessName',
      isSort: true,
      render: (_: string, item: Seller) => {
        const profileImage = item?.profileImage || '/images/user/user-01.png'
        const businessName = item?.businessName || 'Unnamed Business'
        const businessEmail = item?.businessEmail || item?.user?.email || 'No email'

        return (
          <Flex align='center' gap='small'>
            <div className='relative h-10 w-10 overflow-hidden rounded-full'>
              <Image src={profileImage} width={40} height={40} alt={businessName} className='object-cover' />
            </div>
            <div className='flex flex-col'>
              <span className='font-medium text-gray-900'>{businessName}</span>
              <span className='text-sm text-gray-500'>{businessEmail}</span>
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
      header: 'Verification',
      key: 'verificationStatus',
      isSort: true,
      render: (status: string) => getVerificationStatusBadge(status),
    },
    {
      header: 'Location',
      key: 'businessCity',
      render: (_: string, item: Seller) => {
        const city = item?.businessCity || 'N/A'
        const country = item?.businessCountry || 'N/A'
        return (
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>{city}</span>
            <span className='text-xs text-gray-500'>{country}</span>
          </div>
        )
      },
    },
    {
      header: 'Stats',
      key: 'totalProducts',
      render: (_: string, item: Seller) => {
        const products = item?.totalProducts || 0
        const sales = item?.totalSales || 0
        const revenue = item?.totalRevenue || 0
        return (
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>{products} products</span>
            <span className='text-xs text-gray-500'>${revenue.toLocaleString()}</span>
          </div>
        )
      },
    },
    {
      header: 'Rating',
      key: 'rating',
      render: (rating: number, item: Seller) => {
        const ratingValue = rating || 0
        const reviewCount = item?.reviewCount || 0
        return (
          <div className='flex flex-col'>
            <span className='text-sm font-medium text-gray-900'>{ratingValue.toFixed(1)} ⭐</span>
            <span className='text-xs text-gray-500'>{reviewCount} reviews</span>
          </div>
        )
      },
    },
    {
      header: 'Joined',
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
      render: (_: unknown, record: Seller) => (
        <div className='flex justify-end gap-2'>
          <button
            className='rounded px-2 py-2 text-primary hover:bg-gray-100'
            onClick={() => router.push(`/sellers/${record.id}`)}
            aria-label={`View ${record.businessName}`}
          >
            <Icon name='AiOutlineEye' color='primary' size='lg' />
          </button>
          <button
            className='rounded px-2 py-2 text-warning hover:bg-gray-100'
            onClick={() => router.push(`/sellers/${record.id}/edit`)}
            aria-label={`Edit ${record.businessName}`}
          >
            <Icon name='AiOutlineFileText' color='warning' size='lg' />
          </button>
          <button
            className='rounded px-2 py-2 text-danger hover:bg-gray-100'
            onClick={() => openDeleteModal(record.id)}
            aria-label={`Delete ${record.businessName}`}
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
        title='Delete Seller'
        description='Are you sure you want to delete this seller? This action cannot be undone.'
      />
    ),
  }
}
