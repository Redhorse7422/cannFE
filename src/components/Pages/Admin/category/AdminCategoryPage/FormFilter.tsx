import type { CategoryFilterValues } from './CategoryFilterContext'

import { useForm } from 'react-hook-form'

import { TextField } from '@/components/FormElements/TextInput'
import { Button } from '@/components/common/Button'
import { Grid, GridItem } from '@/libs/pureTailwind'

import { useCategoryFilter } from './CategoryFilterContext'

export const FormFilter = () => {
  const { setFilters } = useCategoryFilter()
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      search: '',
    },
  })

  const handleOnSubmit = (data: CategoryFilterValues) => {
    setFilters(data)
  }

  const handleReset = () => {
    reset()
    setFilters({
      search: '',
    })
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <Grid col={{ default: 1, lg: 1 }} rowGap={4} colGap={4}>
        <GridItem colStart={{ default: 1, lg: 1 }}>
          <TextField control={control} name='search' label='Search' />
          <div className='mt-3 flex w-full items-center justify-end gap-3'>
            <Button label='Reset' onClick={handleReset} />
            <Button label='Search' type='submit' />
          </div>
        </GridItem>
      </Grid>
    </form>
  )
}
