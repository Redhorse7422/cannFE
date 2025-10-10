'use client'

import type { InputWrapperProps } from '../InputWrapper'
import type { IconAllowed } from '@/components/common/icon'

import React, { useState, useRef, useCallback, useEffect } from 'react'

import clsx from 'clsx'
import Image from 'next/image'

import { Icon } from '@/components/common/icon'

import { InputWrapper } from '../InputWrapper'

export type FileWithPreview = {
  id: string
  file: File
  preview: string | null
  name: string
  size: number
  type: string
  fileId?: string
  url?: string
}

export type UploadedFile = {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  fileId?: string // Backend file ID from response
  fileName?: string // Original filename from response
  mimetype?: string // MIME type from response
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error' | 'existing'

export type FileUploadState = {
  id: string
  file: File
  preview: string | null
  name: string
  size: number
  type: string
  status: UploadStatus
  progress: number
  error?: string
  uploadedFile?: UploadedFile
}

export type EnhancedUploadInputProps = Pick<
  InputWrapperProps,
  | 'errorMsg'
  | 'isError'
  | 'freezeErrorSpace'
  | 'labelAxis'
  | 'width'
  | 'classNames'
  | 'size'
  | 'labelWidth'
  | 'labelPosition'
> & {
  required?: boolean
  label?: string
  iconPrefix?: IconAllowed
  iconSuffix?: IconAllowed
  value?: FileWithPreview[] | string | string[] // Can be file objects or just IDs/URLs
  onChange?: (files: FileWithPreview[] | string | string[]) => void
  accept?: string[]
  multiple?: boolean
  maxCount?: number
  disabled?: boolean
  dragBoxTitle?: string | React.ReactNode
  dragBoxDesc?: string | React.ReactNode
  className?: string
  // Upload mode props
  uploadMode?: 'pick' | 'upload'
  uploadUrl?: string
  uploadHeaders?: Record<string, string>
  uploadFieldName?: string
  valueField?: 'fileId' | 'url' | 'full' // What value to pass to form field
  onUploadStart?: (file: File) => void
  onUploadProgress?: (fileId: string, progress: number) => void
  onUploadSuccess?: (fileId: string, uploadedFile: UploadedFile) => void
  onUploadError?: (fileId: string, error: string) => void
  onUploadComplete?: (uploadedFiles: UploadedFile[]) => void
}

export const EnhancedUploadInput: React.FC<EnhancedUploadInputProps> = (props) => {
  const {
    label,
    required,
    isError,
    errorMsg,
    freezeErrorSpace,
    maxCount: initialMaxCount,
    width,
    labelAxis,
    className,
    classNames,
    labelWidth,
    labelPosition,
    size = 'middle',
    value = [],
    onChange,
    multiple = false,
    accept = ['image/*', '.webp'],
    disabled = false,
    dragBoxTitle = 'Drag & drop files here',
    dragBoxDesc = 'or click to browse',
    // Upload mode props
    uploadMode = 'pick',
    uploadUrl,
    uploadHeaders = {},
    uploadFieldName = 'file',
    valueField = 'fileId',
    onUploadStart,
    onUploadProgress,
    onUploadSuccess,
    onUploadError,
    onUploadComplete,
  } = props

  // Compute maxCount: if not provided, use 1 for single mode and undefined for multiple
  const maxCount = initialMaxCount ?? (multiple ? undefined : 1)

  const [files, setFiles] = useState<FileUploadState[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize files from value prop
  useEffect(() => {
    let nextFiles: FileUploadState[] = []

    if (uploadMode === 'pick') {
      const pickFiles = (value as FileWithPreview[]) || []
      nextFiles = pickFiles.map((file) => ({
        id: file.id,
        file: file.file,
        preview: file.preview,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'idle' as UploadStatus,
        progress: 0,
      }))
    } else if (Array.isArray(value)) {
      const uploadedFiles = value as (UploadedFile | string)[]
      nextFiles = uploadedFiles.map((file, index) => {
        if (typeof file === 'string') {
          return {
            id: `existing-${index}`,
            file: null as any,
            preview: null,
            name: 'Uploaded file',
            size: 0,
            type: 'unknown',
            status: 'existing' as UploadStatus,
            progress: 100,
            uploadedFile: {
              id: `existing-${index}`,
              name: 'Uploaded file',
              size: 0,
              type: 'unknown',
              url: valueField === 'url' ? file : '',
              uploadedAt: new Date(),
              fileId: valueField === 'fileId' ? file : undefined,
            },
          }
        }
        return {
          id: file.id,
          file: null as any,
          preview: file.url || null,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'existing' as UploadStatus,
          progress: 100,
          uploadedFile: file as UploadedFile,
        }
      })
    } else if (typeof value === 'string' && value !== '') {
      nextFiles = [
        {
          id: 'existing-0',
          file: null as any,
          preview: null,
          name: 'Uploaded file',
          size: 0,
          type: 'unknown',
          status: 'existing' as UploadStatus,
          progress: 100,
          uploadedFile: {
            id: 'existing-0',
            name: 'Uploaded file',
            size: 0,
            type: 'unknown',
            url: valueField === 'url' ? value : '',
            uploadedAt: new Date(),
            fileId: valueField === 'fileId' ? value : undefined,
          },
        },
      ]
    }

    // 🔑 Only update state if different
    setFiles((prev) => {
      const same = JSON.stringify(prev) === JSON.stringify(nextFiles)
      return same ? prev : nextFiles
    })
  }, [value, uploadMode, valueField])

  // Create previews and file objects
  const processFiles = useCallback(
    (newFiles: File[]) => {
      const processed: FileUploadState[] = []

      for (const file of newFiles) {
        // Skip if we've reached max count (only when maxCount is defined)
        if (maxCount !== undefined && files.length + processed.length >= maxCount) break

        processed.push({
          id: Math.random().toString(36).slice(2, 11),
          file,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'idle',
          progress: 0,
        })
      }

      return processed
    },
    [files.length, maxCount],
  )

  // Upload file to server
  const uploadFile = useCallback(
    async (fileState: FileUploadState) => {
      if (!uploadUrl) {
        console.error('Upload URL is required for upload mode')
        return
      }

      const formData = new FormData()
      formData.append(uploadFieldName, fileState.file)

      try {
        onUploadStart?.(fileState.file)

        const xhr = new XMLHttpRequest()

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100)
            setFiles((prev) =>
              prev.map((f) => (f.id === fileState.id ? { ...f, status: 'uploading' as UploadStatus, progress } : f)),
            )
            onUploadProgress?.(fileState.id, progress)
          }
        })

        // Handle upload completion
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText)

              // Handle the specific API response format
              const responseData = response.data || response
              const uploadedFile: UploadedFile = {
                id: fileState.id,
                name: fileState.name,
                size: fileState.size,
                type: fileState.type,
                url: responseData.url || '',
                uploadedAt: new Date(),
                fileId: responseData.id, // Backend file ID
                fileName: responseData.fileName, // Original filename
                mimetype: responseData.mimetype, // MIME type
              }

              setFiles((prev) => {
                const next = prev.map((f) =>
                  f.id === fileState.id
                    ? {
                        ...f,
                        status: 'success' as UploadStatus,
                        progress: 100,
                        uploadedFile,
                        preview: f.preview,
                      }
                    : f,
                )

                // Build uploadedFiles from the new state
                const uploadedFiles = next.map((f) => f.uploadedFile).filter(Boolean) as UploadedFile[]

                // Pass the appropriate value based on valueField setting
                let formValue: any
                if (valueField === 'fileId') {
                  formValue = uploadedFiles.map((f) => f.fileId || f.id)
                } else if (valueField === 'url') {
                  formValue = uploadedFiles.map((f) => f.url)
                } else {
                  formValue = uploadedFiles
                }

                onChange?.(formValue)
                onUploadComplete?.(uploadedFiles)

                return next
              })
            } catch (error) {
              console.log(error)
              handleUploadError(fileState.id, 'Invalid response format')
            }
          } else {
            handleUploadError(fileState.id, `Upload failed with status ${xhr.status}`)
          }
        })

        // Handle upload er.idror
        xhr.addEventListener('error', () => {
          handleUploadError(fileState.id, 'Network error occurred')
        })

        xhr.addEventListener('abort', () => {
          handleUploadError(fileState.id, 'Upload was cancelled')
        })

        // Start upload
        xhr.open('POST', uploadUrl)

        // Add headers
        Object.entries(uploadHeaders).forEach(([key, value1]) => {
          xhr.setRequestHeader(key, value1)
        })

        xhr.send(formData)
      } catch (error) {
        handleUploadError(fileState.id, error instanceof Error ? error.message : 'Upload failed')
      }
    },
    [
      uploadUrl,
      uploadFieldName,
      uploadHeaders,
      onUploadStart,
      onUploadProgress,
      onUploadSuccess,
      files,
      onChange,
      onUploadComplete,
    ],
  )

  const handleUploadError = (fileId: string, error: string) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: 'error' as UploadStatus, error } : f)))
    onUploadError?.(fileId, error)
  }

  // Handle file selection via input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    if (!e.target.files || e.target.files.length === 0) return

    const newFiles = processFiles(Array.from(e.target.files))
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles

    // Set files immediately to show preview
    setFiles(updatedFiles)

    if (uploadMode === 'pick') {
      // For pick mode, convert to FileWithPreview format
      const pickFiles: FileWithPreview[] = updatedFiles.map((f) => ({
        id: f.id,
        file: f.file,
        preview: f.preview,
        name: f.name,
        size: f.size,
        type: f.type,
      }))
      onChange?.(pickFiles)
    } else {
      // For upload mode, start uploading each new file immediately
      newFiles.forEach((fileState) => {
        // Set status to uploading immediately
        setFiles((prev) => prev.map((f) => (f.id === fileState.id ? { ...f, status: 'uploading' as UploadStatus } : f)))
        uploadFile(fileState)
      })
    }

    e.target.value = '' // Reset input to allow selecting same file again
  }

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled) return

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || !e.dataTransfer.files || e.dataTransfer.files.length === 0) return

    const newFiles = processFiles(Array.from(e.dataTransfer.files))
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles

    // Set files immediately to show preview
    setFiles(updatedFiles)

    if (uploadMode === 'pick') {
      const pickFiles: FileWithPreview[] = updatedFiles.map((f) => ({
        id: f.id,
        file: f.file,
        preview: f.preview,
        name: f.name,
        size: f.size,
        type: f.type,
      }))
      onChange?.(pickFiles)
    } else {
      // For upload mode, start uploading each new file immediately
      newFiles.forEach((fileState) => {
        // Set status to uploading immediately
        setFiles((prev) => prev.map((f) => (f.id === fileState.id ? { ...f, status: 'uploading' as UploadStatus } : f)))
        uploadFile(fileState)
      })
    }
  }

  // Remove file from selection
  const removeFile = (id: string) => {
    if (disabled) return

    const updatedFiles = files.filter((file) => {
      if (file.id === id && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return file.id !== id
    })

    setFiles(updatedFiles)

    if (uploadMode === 'pick') {
      const pickFiles: FileWithPreview[] = updatedFiles.map((f) => ({
        id: f.id,
        file: f.file,
        preview: f.preview,
        name: f.name,
        size: f.size,
        type: f.type,
      }))
      onChange?.(pickFiles)
    } else {
      const uploadedFiles = updatedFiles.map((f) => f.uploadedFile).filter(Boolean) as UploadedFile[]

      // Pass the appropriate value based on valueField setting
      let formValue: any
      if (valueField === 'fileId') {
        formValue = multiple
          ? uploadedFiles.map((f) => f.fileId || f.id)
          : uploadedFiles[0]?.fileId || uploadedFiles[0]?.id
      } else if (valueField === 'url') {
        formValue = multiple ? uploadedFiles.map((f) => f.url) : uploadedFiles[0]?.url
      } else {
        formValue = multiple ? uploadedFiles : uploadedFiles[0]
      }

      onChange?.(formValue)
    }
  }

  // Retry upload for failed files
  const retryUpload = (id: string) => {
    const fileState = files.find((f) => f.id === id)
    if (fileState && fileState.status === 'error') {
      uploadFile(fileState)
    }
  }

  // Clean up preview URLs
  useEffect(() => {
    return () =>
      files.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
  }, [files])

  // Trigger file input click
  const triggerFileInput = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // File size formatter
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  // Get accept string for input
  const acceptString = accept?.join(',')

  // Show dropzone based on mode and file count
  const showDropzone = multiple ? maxCount === undefined || files.length < maxCount : files.length === 0

  // Get status icon and color
  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'uploading':
        return { icon: 'AiOutlineReload' as const, className: 'text-blue-500 animate-spin' }
      case 'success':
        return { icon: 'AiOutlineCheck' as const, className: 'text-green-500' }
      case 'error':
        return { icon: 'AiOutlineClose' as const, className: 'text-red-500' }
      case 'existing':
        return { icon: 'AiOutlineFile' as const, className: 'text-gray-400' }
      default:
        return { icon: 'AiOutlineFile' as const, className: 'text-gray-400' }
    }
  }

  return (
    <InputWrapper
      label={label}
      required={required}
      isError={isError}
      errorMsg={errorMsg}
      freezeErrorSpace={freezeErrorSpace}
      className={className}
      classNames={classNames}
      labelAxis={labelAxis}
      width={width}
      size={size}
      labelWidth={labelWidth}
      labelPosition={labelPosition}
    >
      <div className='relative w-full'>
        {/* Mode indicator */}
        {uploadMode === 'upload' && (
          <div className='mb-2 flex items-center gap-2'>
            <Icon name='AiOutlineCloudUpload' className='text-blue-500' size='sm' />
            <span className='text-sm font-medium text-blue-600'>Auto-upload mode</span>
          </div>
        )}

        {/* Dropzone Area */}
        {showDropzone && (
          <div
            className={clsx(
              'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
              disabled ? 'cursor-not-allowed bg-gray-100' : 'hover:border-blue-400',
              isError && 'border-red-500',
            )}
            onClick={triggerFileInput}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
              multiple={multiple}
              accept={acceptString}
              disabled={disabled}
            />

            <div className='flex flex-col items-center justify-center gap-2'>
              <Icon
                name={
                  isDragging ? 'AiOutlineUpload' : uploadMode === 'upload' ? 'AiOutlineCloudUpload' : 'AiOutlineFile'
                }
                className='text-gray-400'
                size='2xl'
              />
              <div>
                <p className='font-medium'>{dragBoxTitle}</p>
                <p className='text-sm text-gray-500'>
                  {uploadMode === 'upload' ? 'Files will be uploaded automatically' : dragBoxDesc}
                </p>
              </div>
              {accept && accept.length > 0 && (
                <p className='text-sm text-gray-500'>
                  Accepted: {accept.map((ext) => (ext.startsWith('.') ? ext.slice(1) : ext)).join(', ')}
                </p>
              )}
              {maxCount && maxCount > 1 && <p className='text-sm text-gray-500'>Max files: {maxCount}</p>}
            </div>
          </div>
        )}

        {/* File Previews */}
        {files.length > 0 && (
          <div className='mt-2'>
            <h3 className='mb-2 text-sm font-medium'>
              {uploadMode === 'upload' ? 'Uploaded Files' : 'Selected Files'} ({files.length}
              {maxCount ? `/${maxCount}` : ''})
            </h3>

            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3'>
              {files.map((file) => {
                const statusInfo = getStatusIcon(file.status)
                return (
                  <div
                    key={file.id}
                    className={clsx(
                      'overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-md',
                      isError ? 'border-red-300' : 'border-gray-200',
                      file.status === 'error' && 'border-red-300 bg-red-50',
                      file.status === 'success' && 'border-green-300 bg-green-50',
                      file.status === 'existing' && 'border-gray-200 bg-gray-50',
                    )}
                  >
                    <div className='relative flex aspect-square items-center justify-center bg-gray-50'>
                      {file.preview ? (
                        <Image
                          src={file.preview}
                          alt={file.name}
                          width={200}
                          height={200}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='flex flex-col items-center p-4 text-center'>
                          <Icon name='AiOutlineFileText' className='text-gray-400' size='xl' />
                          <span className='mt-2 w-full truncate px-2 text-xs text-gray-500'>{file.name}</span>
                        </div>
                      )}

                      {/* Status indicator */}
                      <div className='absolute left-2 top-2'>
                        <Icon name={statusInfo.icon} className={statusInfo.className} size='sm' />
                      </div>

                      {/* Progress bar for uploading files */}
                      {file.status === 'uploading' && (
                        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200'>
                          <div
                            className='h-full bg-blue-500 transition-all duration-300'
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}

                      {!disabled && (
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(file.id)
                          }}
                          className='absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600'
                        >
                          <Icon name='AiOutlineClose' size='sm' />
                        </button>
                      )}

                      {/* Retry button for failed uploads */}
                      {file.status === 'error' && !disabled && (
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation()
                            retryUpload(file.id)
                          }}
                          className='absolute bottom-2 right-2 rounded-full bg-blue-500 p-1 text-white transition-colors hover:bg-blue-600'
                        >
                          <Icon name='AiOutlineReload' size='sm' />
                        </button>
                      )}
                    </div>

                    <div className='bg-white p-2'>
                      <p className='truncate text-xs font-medium'>{file.name}</p>
                      <p className='text-xs text-gray-500'>
                        {formatFileSize(file.size)} · {file.type || 'Unknown type'}
                      </p>

                      {/* Upload status and progress */}
                      {uploadMode === 'upload' && (
                        <div className='mt-1'>
                          {file.status === 'uploading' && (
                            <p className='text-xs text-blue-600'>Uploading... {file.progress}%</p>
                          )}
                          {file.status === 'success' && <p className='text-xs text-green-600'>Uploaded successfully</p>}
                          {file.status === 'existing' && <p className='text-xs text-gray-600'>Existing file</p>}
                          {file.status === 'error' && <p className='text-xs text-red-600'>{file.error}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </InputWrapper>
  )
}
