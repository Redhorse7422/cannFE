'use client'

import type { FileWithPreview } from '@/components/FormElements/UploadInput'

import { useState } from 'react'

import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'

// import Link from 'next/link'
import { LoginPopup } from '@/components/Auth/LoginPopup'
import { CheckboxField } from '@/components/FormElements/CheckboxInput'
import { SelectField } from '@/components/FormElements/SelectInput'
const TextField = dynamic(() => import('@/components/FormElements/TextInput').then((m) => m.TextField), {
  ssr: false,
  loading: () => <div className='h-10 w-full animate-pulse rounded bg-gray-100' />,
})
const EnhancedUploadField = dynamic(
  () => import('@/components/FormElements/UploadInput/EnhancedUploadField').then((m) => m.EnhancedUploadField),
  { ssr: false, loading: () => <div className='text-sm text-gray-500'>Loading uploader…</div> },
)
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { US_STATES } from '@/constants/states'
import { useApi } from '@/hooks/useApi'
import useToast from '@/hooks/useToast'
import { logger } from '@/libs/logger.client'
import { Grid, GridItem } from '@/libs/pureTailwind'

type AddressType = 'shipping' | 'billing'

interface AddressForm {
  type: AddressType
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

interface SignupForm {
  // user
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string

  // buyer required
  businessName: string
  businessType: 'Pharmacy' | 'Physician office' | 'Clinic' | 'Hospital' | 'Dental office' | 'Veterinary clinic'

  // buyer optional
  businessDescription?: string
  businessPhone?: string
  businessEmail?: string
  businessWebsite?: string
  businessAddress?: string
  npiNumber?: string
  glinNumber?: string
  stateLicenseNumber?: string
  deaLicenseNumber?: string
  stateBopLicenseNumber?: string
  hasAppliedBankruptcy?: boolean

  // other info
  fax?: string
  ownersName?: string
  accountsPayableManager?: string
  picName?: string
  yearsInBusiness?: string

  // payment
  paymentMethod?: 'ach' | 'check' | 'credit_card'
  paymentAuthorizationFile?: unknown
  statePharmacyLicenseFile?: unknown
  deaLicenseFile?: unknown

  // trade references
  primaryWholesaler?: string
  account1?: string
  secondaryWholesaler?: string
  account2?: string

  // addresses
  shippingAddress: AddressForm
  billingAddress?: AddressForm

  // UI-only helper
  billingSameAsShipping?: boolean
}

const businessTypeOptions = [
  { label: 'Pharmacy', value: 'Pharmacy' },
  { label: 'Physician office', value: 'Physician office' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'Dental office', value: 'Dental office' },
  { label: 'Veterinary clinic', value: 'Veterinary clinic' },
]

export default function SignUpPage() {
  const { showToast } = useToast()
  const { createDataSource } = useApi()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false)
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    // formState: { isValid },
  } = useForm<SignupForm>({
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      businessName: '',
      businessType: 'Pharmacy',
      businessDescription: '',
      businessPhone: '',
      businessEmail: '',
      businessWebsite: '',
      businessAddress: '',
      npiNumber: '',
      glinNumber: '',
      stateLicenseNumber: '',
      deaLicenseNumber: '',
      stateBopLicenseNumber: '',
      hasAppliedBankruptcy: false,
      fax: '',
      ownersName: '',
      accountsPayableManager: '',
      picName: '',
      yearsInBusiness: '',
      paymentMethod: undefined,
      paymentAuthorizationFile: undefined,
      statePharmacyLicenseFile: undefined,
      deaLicenseFile: undefined,
      primaryWholesaler: '',
      account1: '',
      secondaryWholesaler: '',
      account2: '',
      shippingAddress: {
        type: 'shipping',
        firstName: '',
        lastName: '',
        company: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        phone: '',
        isDefault: undefined,
      },
      billingAddress: {
        type: 'billing',
        firstName: '',
        lastName: '',
        company: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        phone: '',
        isDefault: undefined,
      },
      billingSameAsShipping: true,
    },
  })

  const billingSameAsShipping = watch('billingSameAsShipping')

  const submit = async (data: SignupForm) => {
    try {
      setIsSubmitting(true)

      const toBase64 = async (input?: FileWithPreview[] | string | null): Promise<string | undefined> => {
        try {
          if (!input) return undefined
          const arr = Array.isArray(input) ? input : []
          const first = arr[0]
          const file: File | undefined = first?.file
          if (!file) return undefined
          const readAsBase64 = (f: File) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader()
              reader.onload = () => {
                const result = reader.result as string
                const base64 = result.includes(',') ? result.split(',')[1] : result
                resolve(base64)
              }
              reader.onerror = () => reject(new Error('Failed to read file'))
              reader.readAsDataURL(f)
            })
          return await readAsBase64(file)
        } catch {
          return undefined
        }
      }

      const normalize = (a: AddressForm): AddressForm => ({
        type: a.type,
        firstName: a.firstName.trim(),
        lastName: a.lastName.trim(),
        company: a.company?.trim() || undefined,
        addressLine1: a.addressLine1.trim(),
        addressLine2: a.addressLine2?.trim() || undefined,
        city: a.city.trim(),
        state: a.state.trim(),
        postalCode: a.postalCode.trim(),
        country: a.country,
        phone: a.phone?.trim() || undefined,
        isDefault: a.isDefault === true ? true : undefined,
      })

      const shipping = normalize({ ...data.shippingAddress, type: 'shipping', country: 'US' })
      const billingSource = billingSameAsShipping ? data.shippingAddress : data.billingAddress!
      const billing = normalize({ ...billingSource, type: 'billing', country: 'US' })

      const statePharmacyLicenseBase64 = await toBase64(data.statePharmacyLicenseFile as FileWithPreview[] | null)
      const DEALicenseBase64 = await toBase64(data.deaLicenseFile as FileWithPreview[] | null)

      const payload = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
        phone: data.phone?.trim() || undefined,
        businessName: data.businessName.trim(),
        businessType: data.businessType,
        businessDescription: data.businessDescription?.trim() || undefined,
        businessPhone: data.businessPhone?.trim() || undefined,
        businessEmail: data.businessEmail?.trim() || undefined,
        businessWebsite: data.businessWebsite?.trim() || undefined,
        businessAddress: data.businessAddress?.trim() || undefined,
        npiNumber: data.npiNumber?.trim() || undefined,
        glinNumber: data.glinNumber?.trim() || undefined,
        stateLicenseNumber: data.stateLicenseNumber?.trim() || undefined,
        deaLicenseNumber: data.deaLicenseNumber?.trim() || undefined,
        stateBopLicenseNumber: data.stateBopLicenseNumber?.trim() || undefined,
        hasAppliedBankruptcy: !!data.hasAppliedBankruptcy,
        statePharmacyLicenseBase64,
        DEALicenseBase64,
        addresses: [shipping, billing],
      }

      await createDataSource.mutateAsync({ path: '/v1/buyers/public', body: payload })
      showToast('Account created successfully! Please sign in.', 'success')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Signup failed. Please check your inputs and try again.'
      logger.error('Signup failed', error)
      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onToggleSameAsShipping = (checked: boolean) => {
    setValue('billingSameAsShipping', checked)
    if (!checked) return
    const shipping = getValues('shippingAddress')
    if (!shipping) return
    setValue('billingAddress', { ...shipping, type: 'billing', isDefault: undefined })
  }

  return (
    <div className='mx-auto w-full max-w-5xl space-y-6 p-4 md:p-8'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Create Your Account</h1>
        <div className='text-sm'>
          Already have an account?{' '}
          <button onClick={() => setIsLoginPopupOpen(true)} className='text-primary hover:underline'>
            Sign in
          </button>
        </div>
      </div>

      {/* Shipping Info */}
      <Card>
        <h2 className='mb-4 text-lg font-semibold'>Shipping Info</h2>
        <Grid col={12} gap={4}>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='shippingAddress.firstName'
              label='First Name'
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='shippingAddress.lastName'
              label='Last Name'
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={12}>
            <TextField control={control} name='shippingAddress.company' label='Company' />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='shippingAddress.addressLine1'
              label='Address Line 1'
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='shippingAddress.addressLine2' label='Address Line 2' />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField control={control} name='shippingAddress.city' label='City' rules={{ required: 'Required' }} />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <SelectField
              control={control}
              name='shippingAddress.state'
              label='State'
              items={US_STATES}
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField
              control={control}
              name='shippingAddress.postalCode'
              label='Zip'
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='shippingAddress.country'
              label='Country'
              rules={{ required: 'Required' }}
              disabled
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='shippingAddress.phone' label='Phone' />
          </GridItem>
        </Grid>
      </Card>

      {/* Billing Info */}
      <Card>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Billing Info</h2>
          <CheckboxField
            control={control}
            name='billingSameAsShipping'
            label='Same as Shipping Address'
            onChange={(e) => onToggleSameAsShipping(e.target.checked)}
          />
        </div>
        {!billingSameAsShipping && (
          <Grid col={12} gap={4}>
            <GridItem colSpan={{ default: 12, md: 6 }}>
              <TextField
                control={control}
                name='billingAddress.firstName'
                label='First Name'
                rules={{ required: 'Required' }}
              />
            </GridItem>
            <GridItem colSpan={{ default: 12, md: 6 }}>
              <TextField
                control={control}
                name='billingAddress.lastName'
                label='Last Name'
                rules={{ required: 'Required' }}
              />
            </GridItem>
            <GridItem colSpan={12}>
              <TextField control={control} name='billingAddress.company' label='Company' />
            </GridItem>
            <GridItem colSpan={{ default: 12, md: 6 }}>
              <TextField
                control={control}
                name='billingAddress.addressLine1'
                label='Address Line 1'
                rules={{ required: 'Required' }}
              />
            </GridItem>
            <GridItem colSpan={{ default: 12, md: 6 }}>
              <TextField control={control} name='billingAddress.addressLine2' label='Address Line 2' />
            </GridItem>
            <GridItem colSpan={{ default: 12, md: 4 }}>
              <TextField control={control} name='billingAddress.city' label='City' rules={{ required: 'Required' }} />
            </GridItem>
            <GridItem colSpan={{ default: 12, md: 4 }}>
              <SelectField
                control={control}
                name='billingAddress.state'
                label='State'
                items={US_STATES}
                rules={{ required: 'Required' }}
              />
            </GridItem>
            <GridItem colSpan={{ default: 12, md: 4 }}>
              <TextField
                control={control}
                name='billingAddress.postalCode'
                label='Zip'
                rules={{ required: 'Required' }}
              />
            </GridItem>
            <GridItem colSpan={{ default: 12, md: 6 }}>
              <TextField
                control={control}
                name='billingAddress.country'
                label='Country'
                rules={{ required: 'Required' }}
                disabled
              />
            </GridItem>
            <GridItem colSpan={{ default: 12, md: 6 }}>
              <TextField control={control} name='billingAddress.phone' label='Phone' />
            </GridItem>
          </Grid>
        )}
      </Card>

      {/* Payment */}
      <Card>
        <h2 className='mb-4 text-lg font-semibold'>Payment</h2>
        <Grid col={12} gap={4}>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <SelectField
              control={control}
              name='paymentMethod'
              label='Payment Options'
              items={[
                { value: 'ach', label: 'ACH draft (Automatic draft 10th of each month)' },
                { value: 'check', label: 'Check (Net 30)' },
                { value: 'credit_card', label: 'Credit card (Point of sale)' },
              ]}
              placeholder='Select payment option'
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <CheckboxField
              control={control}
              name='hasAppliedBankruptcy'
              label='Have you ever applied for bankruptcy?'
              required
            />
          </GridItem>
        </Grid>
      </Card>

      {/* Business Info */}
      <Card>
        <h2 className='mb-4 text-lg font-semibold'>Business Info</h2>
        <Grid col={12} gap={4}>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='businessName' label='Legal Name' rules={{ required: 'Required' }} />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='businessAddress' label='Business Address' />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <SelectField
              control={control}
              name='businessType'
              label='What type of pharmacy are you?'
              items={businessTypeOptions}
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='businessDescription' label='Business Description' />
          </GridItem>

          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField control={control} name='npiNumber' label='NPI #' rules={{ required: 'Required' }} />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField control={control} name='glinNumber' label='GLIN #' rules={{ required: 'Required' }} />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField
              control={control}
              name='yearsInBusiness'
              label='Years in business'
              rules={{ required: 'Required' }}
            />
          </GridItem>

          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='deaLicenseNumber'
              label='DEA License #'
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='stateBopLicenseNumber'
              label='State BOP lic. #'
              rules={{ required: 'Required' }}
            />
          </GridItem>

          <GridItem colSpan={{ default: 12, md: 6 }}>
            <div className='text-sm font-medium'>State Pharmacy License (upload)</div>
            <EnhancedUploadField
              control={control}
              name='statePharmacyLicenseFile'
              uploadMode='pick'
              maxCount={1}
              rules={{ required: 'Required' }}
              required
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <div className='text-sm font-medium'>DEA License (upload)</div>
            <EnhancedUploadField
              control={control}
              name='deaLicenseFile'
              uploadMode='pick'
              maxCount={1}
              rules={{ required: 'Required' }}
              required
            />
          </GridItem>
        </Grid>
      </Card>

      {/* Other Info */}
      <Card>
        <h2 className='mb-4 text-lg font-semibold'>Other Info</h2>
        <Grid col={12} gap={4}>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField control={control} name='businessPhone' label='Business Phone' rules={{ required: 'Required' }} />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField
              control={control}
              name='businessEmail'
              label='Email'
              type='email'
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField control={control} name='fax' label='Fax' />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField control={control} name='ownersName' label="Owner's Name" />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField
              control={control}
              name='accountsPayableManager'
              label='Account payable manager'
              rules={{ required: 'Required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 4 }}>
            <TextField control={control} name='picName' label='PIC Name' rules={{ required: 'Required' }} />
          </GridItem>
        </Grid>
      </Card>

      {/* Trade Reference */}
      <Card>
        <h2 className='mb-4 text-lg font-semibold'>Trade Reference</h2>
        <Grid col={12} gap={4}>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='primaryWholesaler' label='Primary Wholesaler' />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='account1' label='Account #1' />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='secondaryWholesaler' label='Secondary Wholesaler' />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField control={control} name='account2' label='Account #2' />
          </GridItem>
        </Grid>
      </Card>

      {/* Account Credentials */}
      <Card>
        <h2 className='mb-4 text-lg font-semibold'>Account</h2>
        <Grid col={12} gap={4}>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='firstName'
              label='First Name'
              rules={{ required: 'First name is required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='lastName'
              label='Last Name'
              rules={{ required: 'Last name is required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='email'
              label='Email'
              type='email'
              rules={{ required: 'Email is required' }}
            />
          </GridItem>
          <GridItem colSpan={{ default: 12, md: 6 }}>
            <TextField
              control={control}
              name='password'
              label='Password'
              type='password'
              rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
            />
          </GridItem>
        </Grid>
        <div className='mt-6 flex justify-end'>
          <Button
            label={isSubmitting ? 'Submitting...' : 'Create Account'}
            type='button'
            disabled={isSubmitting}
            onClick={handleSubmit(submit)}
          />
        </div>
      </Card>
      {/* Login Popup */}
      <LoginPopup isOpen={isLoginPopupOpen} onClose={() => setIsLoginPopupOpen(false)} />
    </div>
  )
}
