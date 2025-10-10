import type { NewProductForm } from '..'
import type { Control } from 'react-hook-form'

import type { FC } from 'react'
import React from 'react'

import { CheckboxField } from '@/components/FormElements/CheckboxInput'
import { MultiSelectField } from '@/components/FormElements/MultiSelectField'
import { RichTextField } from '@/components/FormElements/RichText/RichTextField'
import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Card } from '@/components/common/Card'
import { useApi } from '@/hooks/useApi'
import { Grid } from '@/libs/pureTailwind'

type SectionBasicInfoProps = {
  control: Control<NewProductForm>
}

type Category = {
  id: string
  name: string
}

type Seller = {
  id: string
  businessName: string
}

export const SectionBasicInfo: FC<SectionBasicInfoProps> = ({ control }) => {
  const { getDataSource } = useApi()
  const { data: categoriesResp } = getDataSource<{ data: Category[] }>({
    path: '/v1/categories/all',
    query: { limit: 200 },
  })

  const categoryOptions = Array.isArray(categoriesResp?.data)
    ? categoriesResp.data.map((cat) => ({ value: cat.id, label: cat.name }))
    : []

  const { data: sellerOption } = getDataSource<{ data: Seller[] }>({
    path: '/v1/sellers',
    query: { limit: 200 },
  })
  const sellerOptions = Array.isArray(sellerOption?.data)
    ? sellerOption.data.map((cat: any) => ({ value: cat.id, label: cat.businessName }))
    : []

  return (
    <Card className='p-10'>
      <h2 className='mb-4 text-2xl font-bold'>Basic Information</h2>
      <Grid rowGap={2} className='mx-auto max-w-4xl'>
        <TextField
          control={control}
          name='name'
          label='Product Name'
          labelAxis='horizontal'
          labelWidth={180}
          rules={{ required: 'Name is required' }}
          maxLength={500}
        />
        <TextField control={control} name='slug' label='Slug' labelAxis='horizontal' labelWidth={180} maxLength={500} />
        <MultiSelectField
          label='Categories'
          items={categoryOptions}
          name='categoryIds'
          control={control}
          labelAxis='horizontal'
          labelWidth={180}
          // maxLength={500}
        />
        <SelectField
          control={control}
          name='sellerId'
          label='Seller'
          items={sellerOptions}
          placeholder='Select seller'
          labelAxis='horizontal'
          labelWidth={180}
        />
        <TextField
          control={control}
          name='tags'
          label='Tags (comma separated)'
          labelAxis='horizontal'
          labelWidth={180}
          maxLength={500}
        />
        <TextField
          control={control}
          name='shortDescription'
          label='Short Description'
          labelAxis='horizontal'
          labelWidth={180}
          maxLength={500}
        />
        <RichTextField
          control={control}
          name='longDescription'
          label='Long Description'
          placeholder='Detailed product description with all features and benefits'
        />
        <SelectField
          control={control}
          name='productType'
          label='Product Type'
          items={[
            { label: 'Service', value: 'service' },
            { label: 'Product', value: 'product' },
          ]}
          placeholder='Select Product Type'
          labelAxis='horizontal'
          labelWidth={180}
        />
        <CheckboxField
          name='canBePurchased'
          label='Can Be Purchased'
          control={control}
          labelWidth={180}
          labelAxis='horizontal'
        />
      </Grid>
    </Card>
  )
}

export default SectionBasicInfo
