'use client'

import React from 'react'

import { BuyerLayout } from '@/components/Layouts/BuyerLayout/BuyerLayout'
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <BuyerLayout>{children}</BuyerLayout>
}
