'use client'

import type { SellerFilterValues } from '@/types/seller'

import { useForm } from 'react-hook-form'

import { SelectField } from '@/components/FormElements/SelectInput'
import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Grid, GridItem } from '@/libs/pureTailwind'

import { useSellerFilter } from './SellerFilterContext'

export const FormFilter = () => {
  const { setFilters } = useSellerFilter()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      search: '',
      status: '',
      verificationStatus: '',
      businessCity: '',
      businessState: '',
      businessCountry: '',
      dateRange: {
        start: '',
        end: '',
      },
    },
  })

  const handleOnSubmit = (data: SellerFilterValues) => {
    // Clean up data to remove empty strings
    const cleanedData: SellerFilterValues = {
      search: data.search || '',
      status: data.status || '',
      verificationStatus: data.verificationStatus || '',
      businessCity: data.businessCity || '',
      businessState: data.businessState || '',
      businessCountry: data.businessCountry || '',
      dateRange: {
        start: data.dateRange?.start || '',
        end: data.dateRange?.end || '',
      },
    }
    setFilters(cleanedData)
  }

  const handleReset = () => {
    reset()
    setFilters({
      search: '',
      status: '',
      verificationStatus: '',
      businessCity: '',
      businessState: '',
      businessCountry: '',
      dateRange: {
        start: '',
        end: '',
      },
    })
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'inactive', label: 'Inactive' },
  ]

  const verificationStatusOptions = [
    { value: '', label: 'All Verification Status' },
    { value: 'unverified', label: 'Unverified' },
    { value: 'pending', label: 'Pending Verification' },
    { value: 'verified', label: 'Verified' },
    { value: 'rejected', label: 'Verification Rejected' },
  ]

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid col={{ default: 1, md: 2, lg: 3 }} rowGap={4} colGap={4}>
        <GridItem colStart={{ default: 1, md: 1, lg: 1 }}>
          <TextField control={control} name='search' label='Search by business name or description' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 2, lg: 2 }}>
          <SelectField control={control} name='status' label='Status' items={statusOptions} />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 1, lg: 3 }}>
          <SelectField
            control={control}
            name='verificationStatus'
            label='Verification Status'
            items={verificationStatusOptions}
          />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 2, lg: 1 }}>
          <TextField control={control} name='businessCity' label='City' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 1, lg: 2 }}>
          <TextField control={control} name='businessState' label='State' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 2, lg: 3 }}>
          <TextField control={control} name='businessCountry' label='Country' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 1, lg: 1 }}>
          <TextField control={control} name='dateRange.start' label='Start Date' type='date' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 2, lg: 2 }}>
          <TextField control={control} name='dateRange.end' label='End Date' type='date' />
        </GridItem>
        <GridItem colStart={{ default: 1, md: 1, lg: 3 }} colSpan={{ default: 1, md: 2, lg: 1 }}>
          <div className='flex w-full items-center justify-end gap-3'>
            <Button label='Reset' onClick={handleReset} />
            <Button label='Search' type='submit' />
          </div>
        </GridItem>
      </Grid>
    </form>
  )
}
