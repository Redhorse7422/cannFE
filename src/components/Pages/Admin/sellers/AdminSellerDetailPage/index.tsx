'use client'
import type { Seller } from '@/types/seller'

import { useState } from 'react'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { Icon } from '@/components/common/icon'
import { useApi } from '@/hooks/useApi'
import { logger } from '@/libs/logger.client'

export const AdminSellerDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const sellerId = params.id as string
  const [activeTab, setActiveTab] = useState('profile')

  const { getDataSourceById } = useApi()

  const {
    data: sellerData,
    isLoading,
    error,
  } = getDataSourceById<Seller>({
    path: '/v1/sellers',
    id: sellerId,
    enabled: !!sellerId,
    query: {
      id: sellerId,
    },
    // params: {
    //   includeUser: 'true',
    //   includeProducts: 'true',
    // },
  })

  console.log('Seller Data ==> ', sellerData)

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <Icon name='AiOutlineLoading' className='mx-auto h-8 w-8 animate-spin text-primary' />
          <p className='mt-2 text-gray-600'>Loading seller details...</p>
        </div>
      </div>
    )
  }

  if (error || !sellerData) {
    logger.error('Failed to fetch seller:', error)
    return (
      <div className='rounded-lg bg-white p-6 shadow'>
        <div className='text-center'>
          <Icon name='AiOutlineCloseCircle' className='mx-auto h-12 w-12 text-red-500' />
          <h2 className='mt-4 text-xl font-semibold text-gray-900'>Seller Not Found</h2>
          <p className='mt-2 text-gray-600'>The seller you are looking for does not exist or has been deleted.</p>
          <Button label='Back to Sellers' onClick={() => router.push('/sellers')} className='mt-4' />
        </div>
      </div>
    )
  }

  // const sellerData = seller

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
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const getVerificationStatusBadge = (status: string) => {
    const statusConfig = {
      unverified: { color: 'bg-gray-100 text-gray-800', label: 'Unverified' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Verification' },
      verified: { color: 'bg-green-100 text-green-800', label: 'Verified' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Verification Rejected' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: 'bg-gray-100 text-gray-800',
      label: status,
    }
    return (
      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'AiOutlineUser' },
    { id: 'business', label: 'Business Info', icon: 'AiOutlineShop' },
    { id: 'documents', label: 'Documents', icon: 'AiOutlineFileText' },
    { id: 'stats', label: 'Statistics', icon: 'AiOutlineBarChart' },
  ]

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button
            icon='AiOutlineArrowLeft'
            label='Back'
            variant='outlinePrimary'
            onClick={() => router.push('/sellers')}
          />
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{sellerData.businessName || 'Unnamed Business'}</h1>
            <p className='text-gray-600'>Seller Details</p>
          </div>
        </div>
        <div className='flex gap-3'>
          <Button
            icon='AiOutlineFileText'
            label='Edit Seller'
            variant='outlinePrimary'
            onClick={() => router.push(`/sellers/${sellerId}/edit`)}
          />
        </div>
      </div>

      {/* Status Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card>
          <div className='text-center'>
            <p className='text-sm font-medium text-gray-600'>Status</p>
            <div className='mt-2'>{getStatusBadge(sellerData.status)}</div>
          </div>
        </Card>
        <Card>
          <div className='text-center'>
            <p className='text-sm font-medium text-gray-600'>Verification</p>
            <div className='mt-2'>{getVerificationStatusBadge(sellerData.verificationStatus)}</div>
          </div>
        </Card>
        <Card>
          <div className='text-center'>
            <p className='text-sm font-medium text-gray-600'>Products</p>
            <p className='mt-2 text-2xl font-bold text-gray-900'>{sellerData.totalProducts || 0}</p>
          </div>
        </Card>
        <Card>
          <div className='text-center'>
            <p className='text-sm font-medium text-gray-600'>Total Revenue</p>
            <p className='mt-2 text-2xl font-bold text-gray-900'>${(sellerData.totalRevenue || 0).toLocaleString()}</p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {/* <Icon name={tab.icon as any} size='sm' /> */}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='space-y-6'>
        {activeTab === 'profile' && (
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Profile Information</h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='flex items-center gap-4'>
                <div className='relative h-20 w-20 overflow-hidden rounded-full'>
                  <Image
                    src={sellerData.profileImage || '/images/user/user-01.png'}
                    width={80}
                    height={80}
                    alt={sellerData.businessName || 'Seller'}
                    className='object-cover'
                  />
                </div>
                <div>
                  <h4 className='font-semibold text-gray-900'>
                    {sellerData.user?.firstName} {sellerData.user?.lastName}
                  </h4>
                  <p className='text-gray-600'>{sellerData.user?.email}</p>
                  <p className='text-gray-600'>{sellerData.user?.phone || 'No phone'}</p>
                </div>
              </div>
              <div className='space-y-3'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>User ID</p>
                  <p className='text-gray-900'>{sellerData.userId}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Commission Rate</p>
                  <p className='text-gray-900'>{sellerData.commissionRate || 0}%</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Rating</p>
                  <p className='text-gray-900'>
                    {sellerData.rating
                      ? `${sellerData.rating.toFixed(1)} ⭐ (${sellerData.reviewCount || 0} reviews)`
                      : 'No rating'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'business' && (
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Business Information</h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Business Name</p>
                  <p className='text-gray-900'>{sellerData.businessName || 'Not provided'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Business Description</p>
                  <p className='text-gray-900'>{sellerData.businessDescription || 'Not provided'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Business Email</p>
                  <p className='text-gray-900'>{sellerData.businessEmail || 'Not provided'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Business Phone</p>
                  <p className='text-gray-900'>{sellerData.businessPhone || 'Not provided'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Business Website</p>
                  <p className='text-gray-900'>
                    {sellerData.businessWebsite ? (
                      <a
                        href={sellerData.businessWebsite}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:underline'
                      >
                        {sellerData.businessWebsite}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
              </div>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Address</p>
                  <p className='text-gray-900'>
                    {sellerData.businessAddress ? (
                      <>
                        {sellerData.businessAddress}
                        <br />
                        {sellerData.businessCity}, {sellerData.businessState} {sellerData.businessPostalCode}
                        <br />
                        {sellerData.businessCountry}
                      </>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Tax ID</p>
                  <p className='text-gray-900'>{sellerData.taxId || 'Not provided'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>License Number</p>
                  <p className='text-gray-900'>{sellerData.licenseNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-600'>License Expiry</p>
                  <p className='text-gray-900'>
                    {sellerData.licenseExpiryDate
                      ? new Date(sellerData.licenseExpiryDate).toLocaleDateString()
                      : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Documents & Verification</h3>
            <div className='space-y-4'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Verification Documents</p>
                <p className='text-gray-900'>{sellerData.verificationDocuments || 'No documents uploaded'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Payout Method</p>
                <p className='text-gray-900'>{sellerData.payoutMethod || 'Not configured'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Payout Details</p>
                <p className='text-gray-900'>{sellerData.payoutDetails || 'Not provided'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Notes</p>
                <p className='text-gray-900'>{sellerData.notes || 'No notes'}</p>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'stats' && (
          <Card>
            <h3 className='mb-4 text-lg font-semibold'>Statistics</h3>
            <div className='grid grid-cols-2 gap-6 md:grid-cols-4'>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600'>Total Products</p>
                <p className='mt-2 text-2xl font-bold text-gray-900'>{sellerData.totalProducts || 0}</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600'>Total Sales</p>
                <p className='mt-2 text-2xl font-bold text-gray-900'>{sellerData.totalSales || 0}</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600'>Total Orders</p>
                <p className='mt-2 text-2xl font-bold text-gray-900'>{sellerData.totalOrders || 0}</p>
              </div>
              <div className='text-center'>
                <p className='text-sm font-medium text-gray-600'>Total Revenue</p>
                <p className='mt-2 text-2xl font-bold text-gray-900'>
                  ${(sellerData.totalRevenue || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className='mt-6 space-y-4'>
              <div>
                <p className='text-sm font-medium text-gray-600'>Approved At</p>
                <p className='text-gray-900'>
                  {sellerData.approvedAt ? new Date(sellerData.approvedAt).toLocaleString() : 'Not approved yet'}
                </p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Approved By</p>
                <p className='text-gray-900'>{sellerData.approvedBy || 'Not approved yet'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Created At</p>
                <p className='text-gray-900'>{new Date(sellerData.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600'>Last Updated</p>
                <p className='text-gray-900'>{new Date(sellerData.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
