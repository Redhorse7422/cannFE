'use client'
import type { FeeScheduleSearchParams } from '../../../../../services/feeSchedule.services'

import React, { useState, useEffect } from 'react'

import { SearchIcon, XMarkIcon } from '@/assets/icons'
import { SelectInput } from '@/components/FormElements/SelectInput'
import { TextInput } from '@/components/FormElements/TextInput'

import { getLocatorData } from '../../../../../services/feeSchedule.services'

interface FeeScheduleSearchFormProps {
  onSearch: (params: FeeScheduleSearchParams) => void
  onClear: () => void
  isLoading: boolean
  initialValues?: FeeScheduleSearchParams
}

export const FeeScheduleSearchForm: React.FC<FeeScheduleSearchFormProps> = ({
  onSearch,
  onClear,
  isLoading,
  initialValues = {},
}) => {
  const [formData, setFormData] = useState<FeeScheduleSearchParams>({
    hcpcs: initialValues.hcpcs || '',
    description: initialValues.description || '',
    modifier: initialValues.modifier || '',
    status: initialValues.status || '',
    effectiveDate: initialValues.effectiveDate || '',
    location: initialValues.location || '',
    year: initialValues.year || new Date().getFullYear().toString(),
    infoType: initialValues.infoType || 'pricing',
    hcpcsMode: initialValues.hcpcsMode || 'single',
    hcpcsList: initialValues.hcpcsList || ['', '', '', '', ''],
    hcpcsStart: initialValues.hcpcsStart || '',
    hcpcsEnd: initialValues.hcpcsEnd || '',
    modifierOption: initialValues.modifierOption || 'all',
    macOption: initialValues.macOption || 'national',
  })
  const [isLoadingLocator, setIsLoadingLocator] = useState(false)
  const [macOptions, setMacOptions] = useState<{ value: string; label: string }[]>([])
  const [localityOptions, setLocalityOptions] = useState<{ value: string; label: string }[]>([])
  const [specificMacOptions, setSpecificMacOptions] = useState<{ value: string; label: string }[]>([])

  const handleInputChange = (field: keyof FeeScheduleSearchParams, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Load locator data when year changes
    if (field === 'year') {
      loadLocatorData(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned: FeeScheduleSearchParams = {
      ...formData,
      hcpcsList: (formData.hcpcsList || []).filter((c) => (c || '').trim().length > 0),
    }
    console.log('[FeeScheduleSearchForm] submit with formData:', cleaned)
    onSearch(cleaned)
  }

  const handleClear = () => {
    console.log('[FeeScheduleSearchForm] clear clicked')
    setFormData({
      hcpcs: '',
      description: '',
      modifier: '',
      status: '',
      effectiveDate: '',
      location: '',
      year: new Date().getFullYear().toString(),
      infoType: 'pricing',
      hcpcsMode: 'single',
      hcpcsList: ['', '', '', '', ''],
      hcpcsStart: '',
      hcpcsEnd: '',
      modifierOption: 'all',
      macOption: 'national',
    })
    onClear()
  }

  // Load locator data for MAC/Locality options
  const loadLocatorData = async (year: string) => {
    console.log('[FeeScheduleSearchForm] loading locator data for year:', year)
    setIsLoadingLocator(true)
    try {
      const response = await getLocatorData(year)
      console.log('[FeeScheduleSearchForm] locator response:', response)
      if (response.code === 0 && response.data) {
        // Create unique MAC options
        const uniqueMacs = Array.from(new Set(response.data.map((item) => item.mac)))
        const newMacOptions = [
          { value: 'national', label: 'National Payment Amount' },
          { value: 'mac', label: 'Specific MAC' },
          { value: 'locality', label: 'Specific Locality' },
          { value: 'all_macs', label: 'All MACs' },
        ]
        setMacOptions(newMacOptions)

        // Create specific MAC options for selection
        const newSpecificMacOptions = [
          { value: '', label: 'Select a MAC' },
          ...uniqueMacs.map((mac) => {
            const item = response.data.find((d) => d.mac === mac)
            return {
              value: mac,
              label: `${mac} - ${item?.mac_description || mac}`,
            }
          }),
        ]
        setSpecificMacOptions(newSpecificMacOptions)

        // Create locality options (filtered by selected MAC if applicable)
        const newLocalityOptions = [
          { value: '', label: 'All Localities' },
          ...response.data.map((item) => ({
            value: `${item.mac}|${item.locality}`,
            label: `${item.locality} - ${item.loc_description} (${item.mac})`,
          })),
        ]
        setLocalityOptions(newLocalityOptions)
      }
    } catch (error) {
      console.error('[FeeScheduleSearchForm] error loading locator data:', error)
    } finally {
      setIsLoadingLocator(false)
    }
  }

  // Load locator data on component mount
  useEffect(() => {
    // Load locator data for default year (2025)
    loadLocatorData('2025')
  }, [])

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>Search Fee Schedule</h2>
        <button
          type='button'
          onClick={handleClear}
          className='flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700'
        >
          <XMarkIcon className='h-4 w-4' />
          Clear Search
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {/* Year */}
        <SelectInput
          label='Year'
          items={[
            { value: '2025', label: '2025' },
            { value: '2024B', label: '2024B' },
            { value: '2024A', label: '2024A' },
            { value: '2023', label: '2023' },
            { value: '2022', label: '2022' },
            { value: '2021', label: '2021' },
          ]}
          value={formData.year || '2025'}
          onChange={(value) => handleInputChange('year', (value as string) || '2025')}
          helperText='Calendar year (with A/B where applicable)'
        />

        {/* Information Type */}
        <SelectInput
          label='Information Type'
          items={[
            { value: 'pricing', label: 'Pricing Information' },
            // { value: 'policy', label: 'Payment Policy Indicators' },
            { value: 'rvu', label: 'Relative Value Units (RVUs)' },
            // { value: 'gpci', label: 'GPCI' },
            { value: 'all', label: 'All' },
          ]}
          value={formData.infoType || 'pricing'}
          onChange={(value) =>
            handleInputChange('infoType', (value as 'pricing' | 'policy' | 'rvu' | 'gpci' | 'all') || 'pricing')
          }
          helperText='Choose the type of information to display'
        />

        {/* HCPCS Mode */}
        <SelectInput
          label='HCPCS Criteria'
          items={[
            { value: 'single', label: 'Single HCPCS Code' },
            // { value: 'list', label: 'List of HCPCS Codes' },
            { value: 'range', label: 'Range of HCPCS Codes' },
          ]}
          value={formData.hcpcsMode || 'single'}
          onChange={(value) => handleInputChange('hcpcsMode', (value as 'single' | 'list' | 'range') || 'single')}
          helperText='Select how you want to enter HCPCS codes'
        />

        {/* HCPCS Single */}
        {formData.hcpcsMode === 'single' && (
          <TextInput
            label='HCPCS Code'
            placeholder='e.g., 99213'
            value={formData.hcpcs}
            onChange={(value) => handleInputChange('hcpcs', value || '')}
            helperText='Enter a single HCPCS code'
          />
        )}

        {/* HCPCS List */}
        {/* {formData.hcpcsMode === 'list' && (
          <div className='col-span-1 md:col-span-2 lg:col-span-3'>
            <label className='mb-2 block text-sm font-medium text-gray-700'>HCPCS Codes (up to 5)</label>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
              {Array.from({ length: 5 }, (_, idx) => (
                <TextInput
                  key={idx}
                  label={`Code ${idx + 1}`}
                  placeholder='e.g., 99213'
                  value={(formData.hcpcsList && formData.hcpcsList[idx]) || ''}
                  onChange={(value) => {
                    const list = [...(formData.hcpcsList || ['', '', '', '', ''])]
                    list[idx] = value || ''
                    setFormData((prev) => ({ ...prev, hcpcsList: list }))
                  }}
                />
              ))}
            </div>
          </div>
        )} */}

        {/* HCPCS Range */}
        {formData.hcpcsMode === 'range' && (
          <>
            <TextInput
              label='HCPCS Start'
              placeholder='e.g., 99201'
              value={formData.hcpcsStart}
              onChange={(value) => handleInputChange('hcpcsStart', value || '')}
            />
            <TextInput
              label='HCPCS End'
              placeholder='e.g., 99499'
              value={formData.hcpcsEnd}
              onChange={(value) => handleInputChange('hcpcsEnd', value || '')}
            />
          </>
        )}

        {/* Modifier Option - hidden for GPCI */}
        {formData.infoType !== 'gpci' && (
          <SelectInput
            label='Modifier Option'
            items={[
              { value: 'all', label: 'All Modifiers' },
              { value: 'global', label: 'Global (Diagnostic Service)' },
              { value: '26', label: '26 Professional Component' },
              { value: 'tc', label: 'TC Technical Component' },
              { value: '53', label: '53 Discontinued Procedure' },
            ]}
            value={formData.modifierOption || 'all'}
            onChange={(value) =>
              handleInputChange('modifierOption', (value as 'global' | '26' | '53' | 'tc' | 'all') || 'all')
            }
            helperText='Choose how to treat modifiers in results'
          />
        )}

        {/* MAC Option - hidden for Payment Policy Indicators or RVUs */}
        {formData.infoType !== 'policy' && formData.infoType !== 'rvu' && (
          <SelectInput
            label='Payment Region (MAC)'
            items={
              macOptions.length > 0
                ? macOptions
                : [
                    { value: 'national', label: 'National Payment Amount' },
                    { value: 'mac', label: 'Specific MAC' },
                    { value: 'locality', label: 'Specific Locality' },
                    { value: 'all_macs', label: 'All MACs' },
                  ]
            }
            value={formData.macOption || 'national'}
            onChange={(value) =>
              handleInputChange('macOption', (value as 'national' | 'mac' | 'locality' | 'all_macs') || 'national')
            }
            helperText={isLoadingLocator ? 'Loading MAC options...' : 'Select which payment geography to use'}
            disabled={isLoadingLocator}
          />
        )}

        {/* Specific MAC Option - only show when Specific MAC is selected */}
        {formData.infoType !== 'policy' && formData.infoType !== 'rvu' && formData.macOption === 'mac' && (
          <SelectInput
            label='Specific MAC'
            items={specificMacOptions}
            value={formData.carrier || ''}
            onChange={(value) => handleInputChange('carrier', (value as string) || '')}
            helperText={isLoadingLocator ? 'Loading MACs...' : 'Select a specific MAC'}
            disabled={isLoadingLocator}
          />
        )}

        {/* Specific Locality Option - only show when Specific Locality is selected */}
        {formData.infoType !== 'policy' && formData.infoType !== 'rvu' && formData.macOption === 'locality' && (
          <SelectInput
            label='Specific Locality'
            items={localityOptions}
            value={formData.location || ''}
            onChange={(value) => handleInputChange('location', (value as string) || '')}
            helperText={isLoadingLocator ? 'Loading localities...' : 'Select specific locality'}
            disabled={isLoadingLocator}
          />
        )}

        {/* Status */}
        {/* <SelectInput
          label='Status'
          items={statusOptions}
          value={formData.status}
          onChange={(value) => handleInputChange('status', value || '')}
          helperText='Filter by procedure status'
        /> */}

        {/* Effective Date */}
        {/* <TextInput
          label='Effective Date'
          type='date'
          value={formData.effectiveDate}
          onChange={(value) => handleInputChange('effectiveDate', value || '')}
          helperText='Filter by effective date'
        /> */}

        {/* Location */}
        {/* <SelectInput
          label='Geographic Location'
          items={locations}
          value={formData.location}
          onChange={(value) => handleInputChange('location', value || '')}
          helperText={isLoadingLocations ? 'Loading locations...' : 'Select geographic location for pricing'}
          disabled={isLoadingLocations}
        /> */}
      </div>

      {/* Search Button */}
      <div className='flex justify-center pt-4'>
        <button
          type='submit'
          disabled={isLoading}
          className='flex items-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? (
            <>
              <div className='h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
              Searching...
            </>
          ) : (
            <>
              <SearchIcon className='h-5 w-5' />
              Search Fee Schedule
            </>
          )}
        </button>
      </div>
    </form>
  )
}
