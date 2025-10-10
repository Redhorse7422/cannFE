'use client'

import type { FileWithPreview } from '@/components/FormElements/UploadInput/EnhancedUploadInput'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from './SectionAction'
import { SectionCategoryDetail } from './SectionCategoryDetail'

export type NewCategoryForm = {
  isActive: boolean
  name: string
  slug: string
  parentId: string
  isFeatured: boolean
  description: string
  longDescription: string
  thumbnail: FileWithPreview[]
  coverImage: FileWithPreview[]
}

const defaultValues: NewCategoryForm = {
  isActive: true,
  name: '',
  slug: '',
  parentId: '',
  isFeatured: false,
  longDescription: '',
  description: '',
  thumbnail: [],
  coverImage: [],
}

export const AdminAddCategoryPage = () => {
  const { control, handleSubmit } = useForm<NewCategoryForm>({
    defaultValues,
  })

  const router = useRouter()
  const { showToast } = useToast()
  const { createDataSource } = useApi()
  const fullLoading = useFullScreenLoading()

  const handleOnSubmit = async (data: NewCategoryForm) => {
    try {
      fullLoading.open()
      await createDataSource.mutateAsync({
        path: '/v1/categories/store',
        body: {
          name: data.name.trim(),
          slug: data.slug.trim(),
          isActive: data.isActive,
          ...(data.parentId && { parentId: data.parentId.trim() }),
          isFeatured: data.isFeatured,
          description: data.description.trim(),
          longDescription: data.longDescription,
          thumbnailImageId: data.thumbnail.length > 0 && data.thumbnail[0].fileId ? data.thumbnail[0].fileId : null,
          coverImageId: data.coverImage.length > 0 && data.coverImage[0].fileId ? data.coverImage[0].fileId : null,
        },
      })

      showToast('Category created successfully!', 'success')
      router.push('/categories')
    } catch (error) {
      logger.error('Failed to create category:', error)
      showToast('Failed to create category. Please try again.', 'error')
    } finally {
      fullLoading.close()
    }
  }

  return (
    <form className='flex flex-col gap-y-6' onSubmit={handleSubmit(handleOnSubmit)}>
      <SectionCategoryDetail control={control} />
      <SectionAction />
    </form>
  )
}
