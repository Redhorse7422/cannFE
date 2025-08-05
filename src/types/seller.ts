// Seller Management Types

export type SellerStatus = 'pending' | 'approved' | 'rejected' | 'suspended' | 'inactive'
export type SellerVerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export interface Seller {
  id: string
  userId: string
  businessName?: string
  businessDescription?: string
  businessPhone?: string
  businessEmail?: string
  businessWebsite?: string
  businessAddress?: string
  businessCity?: string
  businessState?: string
  businessPostalCode?: string
  businessCountry?: string
  taxId?: string
  licenseNumber?: string
  licenseExpiryDate?: string
  status: SellerStatus
  verificationStatus: SellerVerificationStatus
  verificationDocuments?: string
  profileImage?: string
  bannerImage?: string
  commissionRate?: number
  payoutMethod?: string
  payoutDetails?: string
  notes?: string
  totalProducts?: number
  totalSales?: number
  totalOrders?: number
  totalRevenue?: number
  rating?: number
  reviewCount?: number
  approvedAt?: string
  approvedBy?: string
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    isActive?: boolean
  }
}

export interface SellerFilterValues {
  search: string
  status: string
  verificationStatus: string
  businessCity: string
  businessState: string
  businessCountry: string
  dateRange: {
    start: string
    end: string
  }
}

export interface SellerStats {
  total: number
  pending: number
  approved: number
  rejected: number
  suspended: number
  inactive: number
  verified: number
  unverified: number
  pendingVerification: number
}

export interface CreateSellerData {
  userId: string
  businessName?: string
  businessDescription?: string
  businessPhone?: string
  businessEmail?: string
  businessWebsite?: string
  businessAddress?: string
  businessCity?: string
  businessState?: string
  businessPostalCode?: string
  businessCountry?: string
  taxId?: string
  licenseNumber?: string
  licenseExpiryDate?: string
  status?: SellerStatus
  verificationStatus?: SellerVerificationStatus
  verificationDocuments?: string
  profileImage?: string
  bannerImage?: string
  commissionRate?: number
  payoutMethod?: string
  payoutDetails?: string
  notes?: string
}

export interface UpdateSellerData {
  businessName?: string
  businessDescription?: string
  businessPhone?: string
  businessEmail?: string
  businessWebsite?: string
  businessAddress?: string
  businessCity?: string
  businessState?: string
  businessPostalCode?: string
  businessCountry?: string
  taxId?: string
  licenseNumber?: string
  licenseExpiryDate?: string
  status?: SellerStatus
  verificationStatus?: SellerVerificationStatus
  verificationDocuments?: string
  profileImage?: string
  bannerImage?: string
  commissionRate?: number
  payoutMethod?: string
  payoutDetails?: string
  notes?: string
}
