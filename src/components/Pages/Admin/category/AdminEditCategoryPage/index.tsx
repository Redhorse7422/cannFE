'use client'

import type { NewCategoryForm } from '../AdminAddCategoryPage'

import { useEffect } from 'react'

import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { useFullScreenLoading } from '@/providers/FullScreenLoadingProvider'

import { SectionAction } from '../AdminAddCategoryPage/SectionAction'
import { SectionCategoryDetail } from '../AdminAddCategoryPage/SectionCategoryDetail'

import { SectionCategoryRestrictions } from './SectionCategoryRestrictions'

const defaultValues = {
  isActive: true,
  name: '',
  slug: '',
  parentId: '',
  isFeatured: false,
  description: '',
  thumbnail: [],
  coverImage: [],
}

export const AdminEditCategoryPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { showToast } = useToast()
  const fullLoading = useFullScreenLoading()
  const { getDataSourceById, updateDataSource } = useApi()
  const {
    data: productCategory,
    isLoading,
    status,
  } = getDataSourceById({
    path: '/v1/categories',
    id,
    enabled: !!id,
  })

  const { control, handleSubmit, setValue } = useForm<NewCategoryForm>({
    defaultValues,
  })

  useEffect(() => {
    if (isLoading && status === 'pending' && !productCategory) {
      fullLoading.open()
    } else {
      fullLoading.close()
      if (productCategory && typeof productCategory === 'object') {
        setValue('name', (productCategory as any).name ?? '')
        setValue('slug', (productCategory as any).slug ?? '')
        setValue('parentId', (productCategory as any)?.parent?.id ?? '')
        setValue('isActive', (productCategory as any).isActive ?? false)
        setValue('isFeatured', (productCategory as any).isFeatured ?? false)
        setValue('description', (productCategory as any).description ?? '')
        setValue('thumbnail', (productCategory as any).thumbnailImage ? [(productCategory as any).thumbnailImage] : [])
        setValue('coverImage', (productCategory as any).coverImage ? [(productCategory as any).coverImage] : [])
      }
    }
  }, [productCategory, isLoading, status, setValue, fullLoading])

  const handleOnSubmit = async (data: NewCategoryForm) => {
    try {
      fullLoading.open()
      console.log('Submitting data:', data)

      const payload = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        description: data.description.trim(),
        ...(data.parentId && data.parentId.trim() && { parentId: data.parentId.trim() }),
        thumbnailImageId: data.thumbnail.length > 0 
          ? (data.thumbnail[0].fileId || data.thumbnail[0].id || null)
          : null,
        coverImageId: data.coverImage.length > 0 
          ? (data.coverImage[0].fileId || data.coverImage[0].id || null)
          : null,
      }

      console.log('Payload:', payload)

      await updateDataSource.mutateAsync({
        path: `/v1/categories/update/${id}`,
        body: payload,
      })
      
      showToast('Category Updated successfully!', 'success')
      router.push('/categories')
    } catch (error) {
      console.error('Error updating category:', error)
      showToast('An error occurred while updating the category!', 'error')
    } finally {
      fullLoading.close()
    }
  }

  return (
    <form className='flex flex-col gap-y-6' onSubmit={handleSubmit(handleOnSubmit)}>
      <SectionCategoryDetail control={control} />
      {id && <SectionCategoryRestrictions categoryId={id} />}
      <SectionAction updating />
    </form>
  )
}
