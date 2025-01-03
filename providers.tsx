"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import {
  RecoilRoot,
} from 'recoil';
import { EdgeStoreProvider } from './lib/edgestore';
import { ThemeProvider } from './components/theme-provider';


export default function Providers({children}:{
    children: React.ReactNode
}) {
  return (
    <SessionProvider>
      
      <EdgeStoreProvider>
      <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      >
        {children}
      </ThemeProvider>
      </EdgeStoreProvider>
    </SessionProvider>
  )
}
