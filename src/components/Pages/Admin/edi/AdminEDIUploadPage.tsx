'use client'

import React, { useState, useRef } from 'react'

import clsx from 'clsx'

import { Icon } from '@/components/common/icon'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'
import { previewEDIFile, uploadEDIFile, type EDIPreviewResponse } from '@/services/edi.services'

type UploadStep = 'select' | 'preview' | 'complete'

export const AdminEDIUploadPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [autoPublish, setAutoPublish] = useState(false)
  const [currentStep, setCurrentStep] = useState<UploadStep>('select')
  const [previewData, setPreviewData] = useState<EDIPreviewResponse | null>(null)
  const [uploadResult, setUploadResult] = useState<{
    createdProducts: number
    updatedProducts: number
  } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(25)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const fullLoading = useFullScreenLoading()

  const handleFileSelect = (file: File) => {
    // Validate file type - specifically for .x12 EDI files
    const acceptedTypes = [
      'text/plain',
      'application/xml',
      'text/xml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/x12',
      'application/edi-x12',
    ]

    if (!acceptedTypes.includes(file.type) && !file.name.match(/\.(txt|xml|csv|xls|xlsx|edi|x12)$/i)) {
      showToast('Please upload a valid EDI X12 file (.x12)', 'error')
      return
    }

    setSelectedFile(file)
    setUploadResult(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handlePreview = async () => {
    if (!selectedFile) {
      showToast('Please select a file first', 'error')
      return
    }

    try {
      fullLoading.open()
      const response = await previewEDIFile(selectedFile)

      setPreviewData(response)
      setCurrentStep('preview')
      showToast('EDI file parsed successfully!', 'success')
    } catch (error: unknown) {
      console.error('Error previewing EDI file:', error)
      const message = error instanceof Error ? error.message : 'An error occurred while previewing the EDI file'
      showToast(message, 'error')
    } finally {
      fullLoading.close()
    }
  }

  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      showToast('Please select a file first', 'error')
      return
    }

    try {
      fullLoading.open()
      const response = await uploadEDIFile({
        file: selectedFile,
        autoPublish,
      })

      setUploadResult(response.result)
      setCurrentStep('complete')
      showToast('EDI file uploaded successfully!', 'success')
    } catch (error: unknown) {
      console.error('Error uploading EDI file:', error)
      const message = error instanceof Error ? error.message : 'An error occurred while uploading the EDI file'
      showToast(message, 'error')
    } finally {
      fullLoading.close()
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setUploadResult(null)
    setPreviewData(null)
    setCurrentStep('select')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBackToSelect = () => {
    setPreviewData(null)
    setCurrentStep('select')
    setCurrentPage(1)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  // Pagination calculations
  const getPaginatedProducts = () => {
    if (!previewData) return []
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return previewData.preview.products.slice(startIndex, endIndex)
  }

  const totalPages = previewData ? Math.ceil(previewData.preview.products.length / itemsPerPage) : 0

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Header Section */}
      <div className='dark:border-strokedark dark:bg-boxdark rounded-sm border border-stroke bg-white shadow-default'>
        <div className='dark:border-strokedark border-b border-stroke px-6.5 py-4'>
          <h3 className='font-medium text-black dark:text-white'>EDI File Upload</h3>
          <p className='mt-1 text-sm text-gray-500'>
            Upload EDI files to automatically create or update products in the system.
          </p>
        </div>

        <div className='p-6.5'>
          {/* Step Indicator */}
          <div className='mb-6 flex items-center justify-center gap-4'>
            <div className='flex items-center gap-2'>
              <div
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  currentStep === 'select' ? 'bg-primary text-white' : 'bg-success text-white',
                )}
              >
                {currentStep === 'select' ? '1' : <Icon name='AiOutlineCheck' noWrapper />}
              </div>
              <span className='text-sm font-medium'>Select File</span>
            </div>
            <div className='h-0.5 w-16 bg-gray-300 dark:bg-gray-600' />
            <div className='flex items-center gap-2'>
              <div
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  currentStep === 'select'
                    ? 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                    : currentStep === 'preview'
                      ? 'bg-primary text-white'
                      : 'bg-success text-white',
                )}
              >
                {currentStep === 'complete' ? <Icon name='AiOutlineCheck' noWrapper /> : '2'}
              </div>
              <span className='text-sm font-medium'>Preview</span>
            </div>
            <div className='h-0.5 w-16 bg-gray-300 dark:bg-gray-600' />
            <div className='flex items-center gap-2'>
              <div
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  currentStep === 'complete'
                    ? 'bg-success text-white'
                    : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400',
                )}
              >
                {currentStep === 'complete' ? <Icon name='AiOutlineCheck' noWrapper /> : '3'}
              </div>
              <span className='text-sm font-medium'>Complete</span>
            </div>
          </div>

          {/* File Upload Area */}
          {currentStep === 'select' && (
            <div
              className={clsx(
                'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : selectedFile
                    ? 'border-success bg-success/5'
                    : 'dark:border-strokedark border-stroke hover:border-primary dark:hover:border-primary',
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type='file'
                className='hidden'
                onChange={handleFileInputChange}
                accept='.x12,.txt,.xml,.csv,.xls,.xlsx,.edi'
              />

              {selectedFile ? (
                <div className='flex flex-col items-center gap-4'>
                  <div className='rounded-full bg-success p-3'>
                    <Icon name='AiOutlineCheck' className='h-8 w-8 text-white' />
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-medium text-black dark:text-white'>{selectedFile.name}</p>
                    <p className='mt-1 text-sm text-gray-500'>{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <button type='button' onClick={handleReset} className='text-sm text-danger hover:underline'>
                    Remove file
                  </button>
                </div>
              ) : (
                <div className='flex flex-col items-center gap-4'>
                  <div className='dark:bg-meta-4 rounded-full bg-gray-100 p-3'>
                    <Icon name='AiOutlineUpload' className='h-8 w-8 text-gray-600 dark:text-gray-300' />
                  </div>
                  <div className='text-center'>
                    <p className='text-lg font-medium text-black dark:text-white'>Drag and drop your EDI file here</p>
                    <p className='mt-1 text-sm text-gray-500'>or</p>
                    <button
                      type='button'
                      onClick={() => fileInputRef.current?.click()}
                      className='mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90'
                    >
                      <Icon name='AiOutlineFile' className='h-4 w-4' />
                      Browse Files
                    </button>
                  </div>
                  <p className='text-xs text-gray-500'>Supported format: X12 (and TXT, XML, CSV, XLS, XLSX, EDI)</p>
                </div>
              )}
            </div>
          )}
          {/* Auto Publish Option */}
          <div className='mt-6 flex items-center gap-3'>
            <label className='flex cursor-pointer items-center gap-2'>
              <input
                type='checkbox'
                checked={autoPublish}
                onChange={(e) => setAutoPublish(e.target.checked)}
                className='h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary'
              />
              <span className='text-sm font-medium text-black dark:text-white'>Auto Publish Products</span>
            </label>
            <div className='group relative'>
              <Icon name='AiOutlineFileText' className='h-4 w-4 text-gray-400' />
              <div className='absolute left-0 top-6 z-10 hidden w-64 rounded-md bg-black p-2 text-xs text-white group-hover:block'>
                When enabled, products will be automatically published after creation or update.
              </div>
            </div>
          </div>

          {/* Upload Button */}
          <div className='mt-6 flex gap-3'>
            <button
              type='button'
              onClick={handlePreview}
              disabled={!selectedFile}
              className={clsx(
                'inline-flex items-center gap-2 rounded-md px-6 py-3 font-medium text-white transition-colors',
                selectedFile ? 'bg-primary hover:bg-primary/90' : 'cursor-not-allowed bg-gray-300 dark:bg-gray-700',
              )}
            >
              <Icon name='AiOutlineEye' className='h-5 w-5' />
              Preview Products
            </button>
            {selectedFile && (
              <button
                type='button'
                onClick={handleReset}
                className='dark:border-strokedark dark:hover:bg-meta-4 inline-flex items-center gap-2 rounded-md border border-stroke px-6 py-3 font-medium text-black hover:bg-gray-50 dark:text-white'
              >
                <Icon name='AiOutlineClose' className='h-5 w-5' />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {currentStep === 'preview' && previewData && (
        <div className='dark:border-strokedark dark:bg-boxdark rounded-sm border border-stroke bg-white shadow-default'>
          <div className='dark:border-strokedark border-b border-stroke px-6.5 py-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium text-black dark:text-white'>Product Preview</h3>
                <p className='mt-1 text-sm text-gray-500'>
                  Review {previewData.preview.totalProducts} product(s) before importing
                </p>
              </div>
              <button type='button' onClick={handleBackToSelect} className='text-sm text-primary hover:underline'>
                ← Back to file selection
              </button>
            </div>
          </div>

          <div className='p-6.5'>
            {/* Metadata */}
            {previewData.preview.metadata && (
              <div className='dark:bg-meta-4 mb-6 rounded-lg bg-gray-50 p-4'>
                <h4 className='mb-2 text-sm font-medium text-black dark:text-white'>Document Information</h4>
                <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                  {previewData.preview.metadata.senderId && (
                    <div>
                      <span className='text-gray-500'>Sender ID:</span>
                      <p className='font-medium'>{previewData.preview.metadata.senderId}</p>
                    </div>
                  )}
                  {previewData.preview.metadata.receiverId && (
                    <div>
                      <span className='text-gray-500'>Receiver ID:</span>
                      <p className='font-medium'>{previewData.preview.metadata.receiverId}</p>
                    </div>
                  )}
                  {previewData.preview.metadata.documentType && (
                    <div>
                      <span className='text-gray-500'>Document Type:</span>
                      <p className='font-medium'>{previewData.preview.metadata.documentType}</p>
                    </div>
                  )}
                  {previewData.preview.metadata.timestamp && (
                    <div>
                      <span className='text-gray-500'>Timestamp:</span>
                      <p className='font-medium'>{new Date(previewData.preview.metadata.timestamp).toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Parse Errors */}
            {previewData.preview.parseErrors && previewData.preview.parseErrors.length > 0 && (
              <div className='mb-6 rounded-lg bg-warning/10 p-4'>
                <h4 className='mb-2 text-sm font-medium text-warning'>Parse Warnings</h4>
                <ul className='list-inside list-disc text-sm text-gray-600 dark:text-gray-400'>
                  {previewData.preview.parseErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Products Table */}
            <div className='overflow-x-auto'>
              <div className='mb-4 flex items-center justify-between'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, previewData.preview.totalProducts)} of{' '}
                  {previewData.preview.totalProducts} products
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={clsx(
                      'rounded-md px-3 py-1 text-sm font-medium',
                      currentPage === 1
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
                        : 'bg-primary text-white hover:bg-primary/90',
                    )}
                  >
                    <Icon name='AiOutlineLeft' noWrapper />
                  </button>
                  <span className='text-sm font-medium'>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={clsx(
                      'rounded-md px-3 py-1 text-sm font-medium',
                      currentPage === totalPages
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
                        : 'bg-primary text-white hover:bg-primary/90',
                    )}
                  >
                    <Icon name='AiOutlineRight' noWrapper />
                  </button>
                </div>
              </div>

              <table className='w-full table-auto'>
                <thead>
                  <tr className='dark:bg-meta-4 bg-gray-50 text-left'>
                    <th className='px-4 py-3 text-sm font-medium text-black dark:text-white'>SKU</th>
                    <th className='px-4 py-3 text-sm font-medium text-black dark:text-white'>UPC</th>
                    <th className='px-4 py-3 text-sm font-medium text-black dark:text-white'>Product Name</th>
                    <th className='px-4 py-3 text-sm font-medium text-black dark:text-white'>Pack Size</th>
                    <th className='px-4 py-3 text-sm font-medium text-black dark:text-white'>Regular Price</th>
                    <th className='px-4 py-3 text-sm font-medium text-black dark:text-white'>List Price</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedProducts().map((product, index) => (
                    <tr key={index} className='dark:border-strokedark border-b border-stroke hover:bg-gray-50 dark:hover:bg-meta-4'>
                      <td className='px-4 py-3 text-sm'>
                        <span className='font-mono text-xs font-medium'>{product.sku}</span>
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        {product.upc ? (
                          <span className='font-mono text-xs text-gray-600 dark:text-gray-400'>{product.upc}</span>
                        ) : (
                          <span className='text-gray-400'>—</span>
                        )}
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        <span className='font-medium text-black dark:text-white'>{product.name}</span>
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        {product.packSize ? (
                          <span className='rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                            {product.packSize}
                          </span>
                        ) : (
                          <span className='text-gray-400'>—</span>
                        )}
                      </td>
                      <td className='px-4 py-3 text-sm font-medium'>
                        {product.regularPrice ? formatPrice(product.regularPrice) : (
                          <span className='text-gray-400'>—</span>
                        )}
                      </td>
                      <td className='px-4 py-3 text-sm'>
                        {product.listPrice ? (
                          <span className='text-success font-medium'>{formatPrice(product.listPrice)}</span>
                        ) : (
                          <span className='text-gray-400'>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom Pagination */}
              <div className='mt-4 flex items-center justify-between border-t border-stroke pt-4 dark:border-strokedark'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className={clsx(
                      'rounded-md px-3 py-1.5 text-sm',
                      currentPage === 1
                        ? 'cursor-not-allowed text-gray-400'
                        : 'text-primary hover:bg-primary/10',
                    )}
                  >
                    First
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={clsx(
                      'rounded-md border border-stroke px-3 py-1.5 text-sm dark:border-strokedark',
                      currentPage === 1
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
                        : 'bg-white text-black hover:bg-gray-50 dark:bg-boxdark dark:text-white dark:hover:bg-meta-4',
                    )}
                  >
                    Previous
                  </button>
                </div>

                <div className='flex items-center gap-1'>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={clsx(
                          'h-8 w-8 rounded-md text-sm font-medium',
                          currentPage === pageNum
                            ? 'bg-primary text-white'
                            : 'bg-white text-black hover:bg-gray-100 dark:bg-boxdark dark:text-white dark:hover:bg-meta-4',
                        )}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={clsx(
                      'rounded-md border border-stroke px-3 py-1.5 text-sm dark:border-strokedark',
                      currentPage === totalPages
                        ? 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700'
                        : 'bg-white text-black hover:bg-gray-50 dark:bg-boxdark dark:text-white dark:hover:bg-meta-4',
                    )}
                  >
                    Next
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className={clsx(
                      'rounded-md px-3 py-1.5 text-sm',
                      currentPage === totalPages
                        ? 'cursor-not-allowed text-gray-400'
                        : 'text-primary hover:bg-primary/10',
                    )}
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Buttons */}
            <div className='mt-6 flex gap-3'>
              <button
                type='button'
                onClick={handleConfirmUpload}
                className='inline-flex items-center gap-2 rounded-md bg-success px-6 py-3 font-medium text-white hover:bg-success/90'
              >
                <Icon name='AiOutlineCheck' className='h-5 w-5' />
                Confirm & Import Products
              </button>
              <button
                type='button'
                onClick={handleBackToSelect}
                className='dark:border-strokedark dark:hover:bg-meta-4 inline-flex items-center gap-2 rounded-md border border-stroke px-6 py-3 font-medium text-black hover:bg-gray-50 dark:text-white'
              >
                <Icon name='AiOutlineArrowLeft' className='h-5 w-5' />
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {currentStep === 'complete' && uploadResult && (
        <div className='dark:border-strokedark dark:bg-boxdark rounded-sm border border-stroke bg-white shadow-default'>
          <div className='dark:border-strokedark border-b border-stroke px-6.5 py-4'>
            <h3 className='font-medium text-black dark:text-white'>Upload Results</h3>
          </div>
          <div className='p-6.5'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='dark:border-strokedark dark:bg-meta-4 rounded-lg border border-stroke bg-gray-50 p-6'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-full bg-success p-3'>
                    <Icon name='AiOutlinePlus' className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Products Created</p>
                    <p className='text-3xl font-bold text-black dark:text-white'>{uploadResult.createdProducts}</p>
                  </div>
                </div>
              </div>

              <div className='dark:border-strokedark dark:bg-meta-4 rounded-lg border border-stroke bg-gray-50 p-6'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-full bg-warning p-3'>
                    <Icon name='AiOutlineFile' className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>Products Updated</p>
                    <p className='text-3xl font-bold text-black dark:text-white'>{uploadResult.updatedProducts}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-4 rounded-lg bg-success/10 p-4'>
              <p className='text-sm text-success'>
                <Icon name='AiOutlineCheckCircle' className='mr-2 inline h-5 w-5' />
                EDI file processed successfully!
              </p>
            </div>

            {/* Start New Upload Button */}
            <div className='mt-6'>
              <button
                type='button'
                onClick={handleReset}
                className='inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90'
              >
                <Icon name='AiOutlinePlus' className='h-5 w-5' />
                Start New Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className='dark:border-strokedark dark:bg-boxdark rounded-sm border border-stroke bg-white shadow-default'>
        <div className='dark:border-strokedark border-b border-stroke px-6.5 py-4'>
          <h3 className='font-medium text-black dark:text-white'>About EDI Upload</h3>
        </div>
        <div className='p-6.5'>
          <div className='space-y-4 text-sm text-gray-600 dark:text-gray-400'>
            <div className='flex gap-3'>
              <Icon name='AiOutlineFileText' className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
              <div>
                <p className='font-medium text-black dark:text-white'>What is EDI?</p>
                <p className='mt-1'>
                  Electronic Data Interchange (EDI) is a standard format for exchanging business documents
                  electronically. This feature allows you to bulk import product data.
                </p>
              </div>
            </div>
            <div className='flex gap-3'>
              <Icon name='AiOutlineFileDone' className='mt-0.5 h-5 w-5 flex-shrink-0 text-primary' />
              <div>
                <p className='font-medium text-black dark:text-white'>Supported Formats</p>
                <p className='mt-1'>
                  The system primarily supports EDI X12 format (.x12 files). Additional formats like TXT, XML, CSV, and
                  Excel files (XLS, XLSX) are also accepted.
                </p>
              </div>
            </div>
            <div className='flex gap-3'>
              <Icon name='AiOutlineCloseCircle' className='mt-0.5 h-5 w-5 flex-shrink-0 text-warning' />
              <div>
                <p className='font-medium text-black dark:text-white'>Processing Time</p>
                <p className='mt-1'>
                  Large EDI files may take several minutes to process. Please wait for the upload to complete before
                  leaving this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminEDIUploadPage
