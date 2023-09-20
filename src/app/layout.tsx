'use client'

import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Theme } from 'react-daisyui'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <Theme>   <div className={inter.className}>
      {children}
    </div>
    </Theme>

  )
}
