import type { ApiResBodyBase } from '@/types/api'

// Types for CMS PFS data
export interface FeeScheduleItem {
  hcpc?: string
  hcpcs?: string
  description?: string
  sdesc?: string
  nused_for_med?: string
  nfac_price: number
  fac_price: number
  nfac_limiting_charge: number
  fac_limiting_charge: number
  rvuWork: number
  rvuPractice: number
  rvuMalpractice: number
  totalRvu: number
  modifier: string
  status: string
  proc_stat?: string
  effectiveDate: string
  endDate?: string
  locality?: string
  carrier?: string
}

// Minimal type for HCPCS check dataset
export interface HcpcsCheckItem {
  hcpc: string
  proc_stat: string
}

export interface FeeScheduleSearchParams {
  hcpcs?: string
  description?: string
  sdesc?: string
  nused_for_med?: string
  modifier?: string
  status?: string
  proc_stat?: string
  effectiveDate?: string
  location?: string
  carrier?: string
  locality?: string
  // CMS-style filter additions
  year?: string // Calendar year selection
  infoType?: 'pricing' | 'policy' | 'rvu' | 'gpci' | 'all'
  hcpcsMode?: 'single' | 'list' | 'range'
  hcpcsList?: string[]
  hcpcsStart?: string
  hcpcsEnd?: string
  modifierOption?: 'global' | '26' | '53' | 'tc' | 'all'
  macOption?: 'national' | 'mac' | 'locality' | 'all_macs'
  limit?: number
  offset?: number
}

export interface FeeScheduleSearchResponse {
  data: FeeScheduleItem[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

// Types for locator data
export interface LocatorData {
  mac: string
  locality: string
  mac_description: string
  loc_description: string
  gpci_work: number
  gpci_pe: number
  gpci_mp: number
}

// Year to resource ID mapping (pricing dataset `i` and GPCI/locator dataset `l`)
const YEAR_RESOURCE_MAP_FULL: Record<string, { i: string; l: string }> = {
  '2025': {
    i: '715103a9-bed7-514f-8dea-1d6fc2554835',
    l: '9ae64224-7f9a-50c8-8545-85b05edf73fa',
  },
  '2024B': {
    i: '1e6deb9e-153e-5a50-a9ef-d41c057420c2',
    l: 'eb25980c-8188-54b6-b25f-665067332640',
  },
  '2024A': {
    i: 'e47a0f0a-3b71-55e4-8dcd-d4b7088327cb',
    l: '6c0c1c83-f8f4-5e17-b4d7-db5869805f5a',
  },
  '2023': {
    i: '1a9bd6e8-10cb-59e6-9adc-c079c248b378',
    l: 'bd339b9a-503f-5d14-a7a7-081e66a0a78c',
  },
  '2022': {
    i: '3d703d65-fcc5-5d40-ba65-1b57a5a8c517',
    l: '799458f7-ddf0-5292-a2e0-09bcba941687',
  },
  '2021': {
    i: '8c3a7088-6aab-5c89-b41a-b3da645288a7',
    l: 'b43972e4-1b4e-58a9-923e-f3f79f70ff62',
  },
}

// Backwards-compat single-map for places that only need `l`
const YEAR_RESOURCE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(YEAR_RESOURCE_MAP_FULL).map(([year, ids]) => [year, ids.l]),
)

// CMS PFS API Base URL
const CMS_PFS_BASE_URL = 'https://pfs.data.cms.gov/api/v1'

// Properties for RVU information-only requests
const RVU_PROPERTIES: Array<{ resource: 't'; property: string }> = [
  { resource: 't', property: 'hcpc' },
  { resource: 't', property: 'modifier' },
  { resource: 't', property: 'proc_stat' },
  { resource: 't', property: 'pctc' },
  { resource: 't', property: 'nused_for_med' },
  { resource: 't', property: 'rvu_work' },
  { resource: 't', property: 'trans_nfac_pe_naflag' },
  { resource: 't', property: 'trans_nfac_pe' },
  { resource: 't', property: 'full_nfac_pe_naflag' },
  { resource: 't', property: 'full_nfac_pe' },
  { resource: 't', property: 'trans_fac_pe_naflag' },
  { resource: 't', property: 'trans_fac_pe' },
  { resource: 't', property: 'full_fac_pe_naflag' },
  { resource: 't', property: 'full_fac_pe' },
  { resource: 't', property: 'rvu_mp' },
  { resource: 't', property: 'opps_nfac_pe' },
  { resource: 't', property: 'opps_fac_pe' },
  { resource: 't', property: 'opps_mp' },
  { resource: 't', property: 'global' },
  { resource: 't', property: 'mult_surg' },
  { resource: 't', property: 'bilt_surg' },
  { resource: 't', property: 'asst_surg' },
  { resource: 't', property: 'co_surg' },
  { resource: 't', property: 'team_surg' },
  { resource: 't', property: 'phy_superv' },
  { resource: 't', property: 'family_ind' },
  { resource: 't', property: 'sdesc' },
  { resource: 't', property: 'conv_fact' },
]

// Normalize a DKAN/CKAN row into FeeScheduleItem with robust fee calculation
// Note: previously had a row-mapper here; removed due to being unused.

// Search fee schedule data from CMS PFS API
export const searchFeeSchedule = async (
  params: FeeScheduleSearchParams,
): Promise<ApiResBodyBase<FeeScheduleSearchResponse>> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams()

    if (params.hcpcs) queryParams.append('hcpcs', params.hcpcs)
    if (params.description) queryParams.append('description', params.description)
    if (params.modifier) queryParams.append('modifier', params.modifier)
    if (params.status) queryParams.append('status', params.status)
    if (params.proc_stat) queryParams.append('proc_stat', params.proc_stat)
    if (params.effectiveDate) queryParams.append('effectiveDate', params.effectiveDate)
    if (params.location) queryParams.append('location', params.location)
    if (params.carrier) queryParams.append('carrier', params.carrier)
    if (params.locality) queryParams.append('locality', params.locality)
    // CMS-style filters passthrough (backend should interpret as needed)
    if (params.year) queryParams.append('year', params.year)
    if (params.infoType) queryParams.append('infoType', params.infoType)
    if (params.hcpcsMode) queryParams.append('hcpcsMode', params.hcpcsMode)
    if (params.hcpcsList && params.hcpcsList.length) queryParams.append('hcpcsList', params.hcpcsList.join(','))
    if (params.hcpcsStart) queryParams.append('hcpcsStart', params.hcpcsStart)
    if (params.hcpcsEnd) queryParams.append('hcpcsEnd', params.hcpcsEnd)
    if (params.modifierOption) queryParams.append('modifierOption', params.modifierOption)
    if (params.macOption) queryParams.append('macOption', params.macOption)
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.offset) queryParams.append('offset', params.offset.toString())

    const url = `${CMS_PFS_BASE_URL}/fee-schedule?${queryParams.toString()}`
    console.log('[feeSchedule.services] searchFeeSchedule URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      console.warn('[feeSchedule.services] non-OK response:', response.status, response.statusText)
      throw new Error(`CMS PFS API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('[feeSchedule.services] raw API data:', data)

    // Transform the response to match our expected format
    return {
      code: 0,
      data: {
        data: data.results || data.data || [],
        total: data.total || data.count || 0,
        limit: params.limit || 50,
        offset: params.offset || 0,
        hasMore: (data.total || data.count || 0) > (params.offset || 0) + (params.limit || 50),
      },
      message: 'Fee schedule data retrieved successfully',
      request_id: 'pfs-search-' + Date.now(),
    }
  } catch (error) {
    console.error('[feeSchedule.services] Error fetching fee schedule data:', error)

    return {
      code: 1,
      message: error instanceof Error ? error.message : 'Unknown error',
      request_id: 'pfs-error-' + Date.now(),
    }
  }
}

// Get specific fee schedule item by HCPCS code
export const getFeeScheduleItem = async (hcpcs: string): Promise<ApiResBodyBase<FeeScheduleItem>> => {
  try {
    const response = await fetch(`${CMS_PFS_BASE_URL}/fee-schedule/${hcpcs}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`CMS PFS API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return {
      code: 0,
      data: data,
      message: 'Fee schedule item retrieved successfully',
      request_id: 'pfs-item-' + Date.now(),
    }
  } catch (error) {
    console.error('Error fetching fee schedule item:', error)

    return {
      code: 1,
      message: 'Failed to fetch fee schedule item from CMS PFS API',
      request_id: 'pfs-item-' + Date.now(),
    }
  }
}

// Get locator data for MAC/Locality options
export const getLocatorData = async (year: string = '2025'): Promise<ApiResBodyBase<LocatorData[]>> => {
  try {
    const resourceId = YEAR_RESOURCE_MAP[year]
    if (!resourceId) {
      throw new Error(`No resource ID found for year: ${year}`)
    }

    const url = 'https://pfs.data.cms.gov/api/1/datastore/query?search=locatorData&redirect=false&ACA='
    const payload = {
      resources: [{ id: resourceId, alias: 't' }],
      properties: [
        { resource: 't', property: 'mac' },
        { resource: 't', property: 'locality' },
        { resource: 't', property: 'mac_description' },
        { resource: 't', property: 'loc_description' },
        { resource: 't', property: 'gpci_work' },
        { resource: 't', property: 'gpci_pe' },
        { resource: 't', property: 'gpci_mp' },
      ],
      keys: true,
      count: false,
    }

    const response = await fetch('/api/pfs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ url, payload }),
    })

    if (!response.ok) {
      throw new Error(`CMS Locator API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const locatorData: LocatorData[] = data.results || []

    return {
      code: 0,
      data: locatorData,
      message: 'Locator data retrieved successfully',
      request_id: 'pfs-locator-' + Date.now(),
    }
  } catch (error) {
    console.error('Error fetching locator data:', error)

    return {
      code: 1,
      message: 'Failed to fetch locator data from CMS API',
      request_id: 'pfs-locator-' + Date.now(),
    }
  }
}

// Query the HCPCS check dataset with a specific code and return proc status
export const searchHcpcsCheck = async (
  hcpcsCode: string,
  resourceId = '715103a9-bed7-514f-8dea-1d6fc2554835',
): Promise<ApiResBodyBase<HcpcsCheckItem[]>> => {
  try {
    const url = `https://pfs.data.cms.gov/api/1/datastore/query?search=${hcpcsCode}&redirect=false&ACA=`
    const payload = {
      resources: [{ id: resourceId, alias: 't' }],
      properties: [
        { resource: 't', property: 'hcpc' },
        { resource: 't', property: 'proc_stat' },
      ],
      conditions: [{ resource: 't', property: 'hcpc', value: hcpcsCode, operator: '=' }],
      sorts: [],
      offset: 0,
      limit: 500,
      keys: true,
    }

    const resp = await fetch('/api/pfs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ url, payload }),
    })
    if (!resp.ok) {
      throw new Error(`HCPCS check API error: ${resp.status} ${resp.statusText}`)
    }
    const json = await resp.json()
    const items: HcpcsCheckItem[] = Array.isArray(json?.results) ? json.results : []
    return { code: 0, data: items, message: 'HCPCS check results', request_id: 'hcpcs-' + Date.now() }
  } catch (error) {
    return {
      code: 1,
      message: error instanceof Error ? error.message : 'Failed to query HCPCS check dataset',
      request_id: 'hcpcs-' + Date.now(),
    }
  }
}

export const searchPricingSingle = async (
  hcpcsCode: string,
  year: string = '2025',
  macOption?: 'national' | 'mac' | 'locality' | 'all_macs',
  location?: string,
  carrier?: string,
  limit: number = 25,
  offset: number = 0,
  infoType?: 'pricing' | 'policy' | 'rvu' | 'gpci' | 'all',
  modifier?: string,
): Promise<ApiResBodyBase<{ data: FeeScheduleItem[]; total: number; limit: number; offset: number }>> => {
  try {
    const url = `https://pfs.data.cms.gov/api/1/datastore/query?search=pricing_single_${hcpcsCode}&redirect=false&ACA=`
    const yearResources = YEAR_RESOURCE_MAP_FULL[year] || YEAR_RESOURCE_MAP_FULL['2025']
    // If requesting RVU info, query directly against the pricing dataset with alias 't' and no joins
    if (infoType === 'rvu') {
      const payload = {
        resources: [{ id: yearResources.i, alias: 't' }],
        properties: RVU_PROPERTIES,
        conditions: (() => {
          const cond: Array<{ resource: 't'; property: string; value: unknown; operator: string }> = [
            { resource: 't', property: 'hcpc', value: hcpcsCode, operator: '=' },
          ]
          if (modifier && modifier.trim()) {
            cond.push({ resource: 't', property: 'modifier', value: modifier.trim(), operator: '=' })
          }
          return cond
        })(),
        sorts: [],
        offset: Number(offset) || 0,
        limit: Number(limit) || 25,
        keys: true,
      }
      const resp = await fetch('/api/pfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ url, payload }),
      })
      if (!resp.ok) {
        throw new Error(`HCPCS RVU API error: ${resp.status} ${resp.statusText}`)
      }
      const json = await resp.json()
      const items: FeeScheduleItem[] = Array.isArray(json?.results) ? json.results : []
      const total: number = Number(json?.count) || items.length
      return {
        code: 0,
        data: { data: items, total, limit: Number(payload.limit), offset: Number(payload.offset) },
        message: 'HCPCS RVU results',
        request_id: 'hcpcs-rvu-' + Date.now(),
      }
    }
    const payload = {
      resources: [
        { id: yearResources.i, alias: 'i' },
        { id: yearResources.l, alias: 'l' },
      ],
      properties: [

        { resource: 'i', property: 'hcpc' },
        { resource: 'i', property: 'modifier' },
        { resource: 'i', property: 'proc_stat' },
        { resource: 'i', property: 'pctc' },
        { resource: 'i', property: 'sdesc' },
        { resource: 'i', property: 'nused_for_med' },
        { resource: 'i', property: 'rvu_work' },
        { resource: 'i', property: 'conv_fact' },
        { resource: 'i', property: 'global' },
        { resource: 'i', property: 'nfac_pe' },
        { resource: 'i', property: 'fac_pe' },
        { resource: 'i', property: 'nfac_total' },
        { resource: 'i', property: 'fac_total' },
        {
          alias: 'nfac_price',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '+',
                  operands: [
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_work',
                                },
                                {
                                  resource: 'i',
                                  property: 'work_adjustor',
                                },
                              ],
                            },
                          },
                          {
                            resource: 'l',
                            property: 'gpci_work',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'trans_nfac_pe',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_pe',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'rvu_mp',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_mp',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                resource: 'i',
                property: 'conv_fact',
              },
            ],
          },
        },
        {
          alias: 'fac_price',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '+',
                  operands: [
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_work',
                                },
                                {
                                  resource: 'i',
                                  property: 'work_adjustor',
                                },
                              ],
                            },
                          },
                          {
                            resource: 'l',
                            property: 'gpci_work',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'trans_fac_pe',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_pe',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'rvu_mp',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_mp',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                resource: 'i',
                property: 'conv_fact',
              },
            ],
          },
        },
        {
          alias: 'nfac_limiting_charge',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '*',
                  operands: [
                    {
                      expression: {
                        operator: '+',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  expression: {
                                    operator: '*',
                                    operands: [
                                      {
                                        resource: 'i',
                                        property: 'rvu_work',
                                      },
                                      {
                                        resource: 'i',
                                        property: 'work_adjustor',
                                      },
                                    ],
                                  },
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_work',
                                },
                              ],
                            },
                          },
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'trans_nfac_pe',
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_pe',
                                },
                              ],
                            },
                          },
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_mp',
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_mp',
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      resource: 'i',
                      property: 'conv_fact',
                    },
                  ],
                },
              },
              1.0925,
            ],
          },
        },
        {
          alias: 'fac_limiting_charge',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '*',
                  operands: [
                    {
                      expression: {
                        operator: '+',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  expression: {
                                    operator: '*',
                                    operands: [
                                      {
                                        resource: 'i',
                                        property: 'rvu_work',
                                      },
                                      {
                                        resource: 'i',
                                        property: 'work_adjustor',
                                      },
                                    ],
                                  },
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_work',
                                },
                              ],
                            },
                          },
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'trans_fac_pe',
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_pe',
                                },
                              ],
                            },
                          },
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_mp',
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_mp',
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      resource: 'i',
                      property: 'conv_fact',
                    },
                  ],
                },
              },
              1.0925,
            ],
          },
        },
        {
          alias: 'opps_nfac_pmt_amt',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '+',
                  operands: [
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_work',
                                },
                                {
                                  resource: 'i',
                                  property: 'work_adjustor',
                                },
                              ],
                            },
                          },
                          {
                            resource: 'l',
                            property: 'gpci_work',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'opps_nfac_pe',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_pe',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'opps_mp',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_mp',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                resource: 'i',
                property: 'conv_fact',
              },
            ],
          },
        },
        {
          alias: 'opps_fac_pmt_amt',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '+',
                  operands: [
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_work',
                                },
                                {
                                  resource: 'i',
                                  property: 'work_adjustor',
                                },
                              ],
                            },
                          },
                          {
                            resource: 'l',
                            property: 'gpci_work',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'opps_fac_pe',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_pe',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'opps_mp',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_mp',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                resource: 'i',
                property: 'conv_fact',
              },
            ],
          },
        },
      ],
      joins: [
        {
          resource: 'l',
          condition: {
            resource: 'i',
            property: 'year',
            operator: '=',
            value: {
              resource: 'l',
              property: 'year',
            },
          },
        },
      ],
      conditions: (() => {
        const cond: Array<{ resource: string; property: string; value: unknown; operator: string }> = [
          { resource: 'i', property: 'hcpc', value: hcpcsCode, operator: '=' },
        ]
        if (modifier && modifier.trim()) {
          cond.push({ resource: 'i', property: 'modifier', value: modifier.trim(), operator: '=' })
        }
        // National -> enforce national locality code
        if (macOption === 'national') {
          cond.push({ resource: 'l', property: 'locality', value: '0000000', operator: '=' })
        }
        // Specific MAC -> filter by MAC
        if (macOption === 'mac' && carrier) {
          cond.push({ resource: 'l', property: 'mac', value: carrier, operator: '=' })
        }
        // Specific Locality -> filter by locality only
        if (macOption === 'locality' && location) {
          const localityCode = location.includes('|') ? location.split('|')[1] : location
          if (localityCode) {
            cond.push({ resource: 'l', property: 'locality', value: localityCode, operator: '=' })
          }
        }
        return cond
      })(),
      sorts: [],
      offset: Number(offset) || 0,
      limit: Number(limit) || 25,
      keys: true,
    }

    // Debug logging for locality behavior
    try {
      const debugLocality = location && location.includes('|') ? location.split('|')[1] : location
      console.log('[searchPricingSingle] macOption:', macOption, 'location:', location, 'localityCode:', debugLocality)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('[searchPricingSingle] conditions:', (payload as any).conditions)
    } catch {}

    const resp = await fetch('/api/pfs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ url, payload }),
    })
    if (!resp.ok) {
      throw new Error(`HCPCS check API error: ${resp.status} ${resp.statusText}`)
    }
    const json = await resp.json()
    const items: FeeScheduleItem[] = Array.isArray(json?.results) ? json.results : []
    const total: number = Number(json?.count) || items.length
    return {
      code: 0,
      data: { data: items, total, limit: Number(payload.limit), offset: Number(payload.offset) },
      message: 'HCPCS pricing results',
      request_id: 'hcpcs-' + Date.now(),
    }
  } catch (error) {
    return {
      code: 1,
      message: error instanceof Error ? error.message : 'Failed to query HCPCS check dataset',
      request_id: 'hcpcs-' + Date.now(),
    }
  }
}

export const searchPricingRange = async (
  hcpcsCodes: [string, string],
  year: string = '2025',
  macOption?: 'national' | 'mac' | 'locality' | 'all_macs',
  location?: string,
  carrier?: string,
  limit: number = 25,
  offset: number = 0,
  infoType?: 'pricing' | 'policy' | 'rvu' | 'gpci' | 'all',
  modifier?: string,
): Promise<ApiResBodyBase<{ data: FeeScheduleItem[]; total: number; limit: number; offset: number }>> => {
  try {
    const checkCodesUrl = `https://pfs.data.cms.gov/api/1/datastore/query?search=hcpcsCheck${hcpcsCodes[0]}-${hcpcsCodes[1]}&redirect=false&ACA=`
    const yearResources = YEAR_RESOURCE_MAP_FULL[year] || YEAR_RESOURCE_MAP_FULL['2025']
    const codesPyaload = {
      resources: [
        {
          id: yearResources.i,
          alias: 't',
        },
      ],
      properties: [
        {
          resource: 't',
          property: 'hcpc',
        },
        {
          resource: 't',
          property: 'proc_stat',
        },
      ],
      conditions: [
        {
          resource: 't',
          property: 'hcpc',
          value: [hcpcsCodes[0], hcpcsCodes[1]],
          operator: 'between',
        },
        {
          resource: 't',
          property: 'proc_stat',
          value: ['A', 'R', 'T', 'C'],
          operator: 'in',
        },
      ],
      sorts: [],
      offset: 0,
      limit: 500,
      keys: true,
    }
    const getCodes = await fetch('/api/pfs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ url: checkCodesUrl, payload: codesPyaload }),
    })
    if (!getCodes.ok) {
      throw new Error(`HCPCS check API error: ${getCodes.status} ${getCodes.statusText}`)
    }
    const codesJson = await getCodes.json()
    const codesRecords: Record<string, unknown>[] = Array.isArray(codesJson?.results) ? codesJson.results : []
    const codes: string[] = []
    codesRecords.map((item) => codes.push(item.hcpc as string))
    console.log('Codes ==> ', codes)
    const url = `https://pfs.data.cms.gov/api/1/datastore/query?search=pricing_range_${hcpcsCodes[0]}-${hcpcsCodes[1]}&redirect=false&ACA=`
    // If requesting RVU info, query directly against the pricing dataset with alias 't' and no joins
    if (infoType === 'rvu') {
      const payload = {
        resources: [{ id: yearResources.i, alias: 't' }],
        properties: RVU_PROPERTIES,
        conditions: (() => {
          const cond: Array<{ resource: 't'; property: string; value: unknown; operator: string }> = [
            { resource: 't', property: 'hcpc', value: codes, operator: 'in' },
          ]
          if (modifier && modifier.trim()) {
            cond.push({ resource: 't', property: 'modifier', value: modifier.trim(), operator: '=' })
          }
          return cond
        })(),
        sorts: [],
        offset: Number(offset) || 0,
        limit: Number(limit) || 25,
        keys: true,
      }
      const resp = await fetch('/api/pfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ url, payload }),
      })
      if (!resp.ok) {
        throw new Error(`HCPCS RVU API error: ${resp.status} ${resp.statusText}`)
      }
      const json = await resp.json()
      const items: FeeScheduleItem[] = Array.isArray(json?.results) ? json.results : []
      const total: number = Number(json?.count) || items.length
      return {
        code: 0,
        data: { data: items, total, limit: Number(payload.limit), offset: Number(payload.offset) },
        message: 'HCPCS RVU results',
        request_id: 'hcpcs-rvu-' + Date.now(),
      }
    }
    const payload = {
      resources: [
        { id: yearResources.i, alias: 'i' },
        { id: yearResources.l, alias: 'l' },
      ],
      properties: [
        { resource: 'i', property: 'hcpc' },
        { resource: 'i', property: 'modifier' },
        { resource: 'i', property: 'proc_stat' },
        { resource: 'i', property: 'pctc' },
        { resource: 'i', property: 'sdesc' },
        { resource: 'i', property: 'nused_for_med' },
        { resource: 'i', property: 'rvu_work' },
        { resource: 'i', property: 'conv_fact' },
        { resource: 'i', property: 'global' },
        { resource: 'i', property: 'nfac_pe' },
        { resource: 'i', property: 'fac_pe' },
        { resource: 'i', property: 'nfac_total' },
        { resource: 'i', property: 'fac_total' },
        {
          alias: 'nfac_price',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '+',
                  operands: [
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_work',
                                },
                                {
                                  resource: 'i',
                                  property: 'work_adjustor',
                                },
                              ],
                            },
                          },
                          {
                            resource: 'l',
                            property: 'gpci_work',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'trans_nfac_pe',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_pe',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'rvu_mp',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_mp',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                resource: 'i',
                property: 'conv_fact',
              },
            ],
          },
        },
        {
          alias: 'fac_price',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '+',
                  operands: [
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_work',
                                },
                                {
                                  resource: 'i',
                                  property: 'work_adjustor',
                                },
                              ],
                            },
                          },
                          {
                            resource: 'l',
                            property: 'gpci_work',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'trans_fac_pe',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_pe',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'rvu_mp',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_mp',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                resource: 'i',
                property: 'conv_fact',
              },
            ],
          },
        },
        {
          alias: 'nfac_limiting_charge',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '*',
                  operands: [
                    {
                      expression: {
                        operator: '+',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  expression: {
                                    operator: '*',
                                    operands: [
                                      {
                                        resource: 'i',
                                        property: 'rvu_work',
                                      },
                                      {
                                        resource: 'i',
                                        property: 'work_adjustor',
                                      },
                                    ],
                                  },
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_work',
                                },
                              ],
                            },
                          },
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'trans_nfac_pe',
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_pe',
                                },
                              ],
                            },
                          },
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_mp',
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_mp',
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      resource: 'i',
                      property: 'conv_fact',
                    },
                  ],
                },
              },
              1.0925,
            ],
          },
        },
        {
          alias: 'fac_limiting_charge',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '*',
                  operands: [
                    {
                      expression: {
                        operator: '+',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  expression: {
                                    operator: '*',
                                    operands: [
                                      {
                                        resource: 'i',
                                        property: 'rvu_work',
                                      },
                                      {
                                        resource: 'i',
                                        property: 'work_adjustor',
                                      },
                                    ],
                                  },
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_work',
                                },
                              ],
                            },
                          },
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'trans_fac_pe',
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_pe',
                                },
                              ],
                            },
                          },
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_mp',
                                },
                                {
                                  resource: 'l',
                                  property: 'gpci_mp',
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                    {
                      resource: 'i',
                      property: 'conv_fact',
                    },
                  ],
                },
              },
              1.0925,
            ],
          },
        },
        {
          alias: 'opps_nfac_pmt_amt',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '+',
                  operands: [
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_work',
                                },
                                {
                                  resource: 'i',
                                  property: 'work_adjustor',
                                },
                              ],
                            },
                          },
                          {
                            resource: 'l',
                            property: 'gpci_work',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'opps_nfac_pe',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_pe',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'opps_mp',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_mp',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                resource: 'i',
                property: 'conv_fact',
              },
            ],
          },
        },
        {
          alias: 'opps_fac_pmt_amt',
          expression: {
            operator: '*',
            operands: [
              {
                expression: {
                  operator: '+',
                  operands: [
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            expression: {
                              operator: '*',
                              operands: [
                                {
                                  resource: 'i',
                                  property: 'rvu_work',
                                },
                                {
                                  resource: 'i',
                                  property: 'work_adjustor',
                                },
                              ],
                            },
                          },
                          {
                            resource: 'l',
                            property: 'gpci_work',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'opps_fac_pe',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_pe',
                          },
                        ],
                      },
                    },
                    {
                      expression: {
                        operator: '*',
                        operands: [
                          {
                            resource: 'i',
                            property: 'opps_mp',
                          },
                          {
                            resource: 'l',
                            property: 'gpci_mp',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                resource: 'i',
                property: 'conv_fact',
              },
            ],
          },
        },
      ],
      joins: [
        {
          resource: 'l',
          condition: {
            resource: 'i',
            property: 'year',
            operator: '=',
            value: {
              resource: 'l',
              property: 'year',
            },
          },
        },
      ],
      conditions: (() => {
        const cond: Array<{ resource: string; property: string; value: unknown; operator: string }> = [
          { resource: 'i', property: 'hcpc', value: codes, operator: 'in' },
        ]
        if (modifier && modifier.trim()) {
          cond.push({ resource: 'i', property: 'modifier', value: modifier.trim(), operator: '=' })
        }
        if (macOption === 'national') {
          cond.push({ resource: 'l', property: 'locality', value: '0000000', operator: '=' })
        }
        if (macOption === 'mac' && carrier) {
          cond.push({ resource: 'l', property: 'mac', value: carrier, operator: '=' })
        }
        if (macOption === 'locality' && location) {
          const localityCode = location.includes('|') ? location.split('|')[1] : location
          if (localityCode) {
            cond.push({ resource: 'l', property: 'locality', value: localityCode, operator: '=' })
          }
        }
        return cond
      })(),
      sorts: [],
      offset: Number(offset) || 0,
      limit: Number(limit) || 25,
      keys: true,
    }

    // Debug logging for locality behavior
    try {
      const debugLocality = location && location.includes('|') ? location.split('|')[1] : location
      console.log('[searchPricingRange] macOption:', macOption, 'location:', location, 'localityCode:', debugLocality)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log('[searchPricingRange] conditions:', (payload as any).conditions)
    } catch {}

    const resp = await fetch('/api/pfs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ url, payload }),
    })
    if (!resp.ok) {
      throw new Error(`HCPCS check API error: ${resp.status} ${resp.statusText}`)
    }
    const json = await resp.json()
    const items: FeeScheduleItem[] = Array.isArray(json?.results) ? json.results : []
    const total: number = Number(json?.count) || items.length
    return {
      code: 0,
      data: { data: items, total, limit: Number(payload.limit), offset: Number(payload.offset) },
      message: 'HCPCS pricing results',
      request_id: 'hcpcs-' + Date.now(),
    }
  } catch (error) {
    return {
      code: 1,
      message: error instanceof Error ? error.message : 'Failed to query HCPCS check dataset',
      request_id: 'hcpcs-' + Date.now(),
    }
  }
}
