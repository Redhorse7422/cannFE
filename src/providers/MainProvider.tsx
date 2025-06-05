'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'

export function MainProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme='light' attribute='class'>
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
