"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { EdgeStoreProvider } from './lib/edgestore';
import { ThemeProvider } from './components/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';


export default function Providers({children}:{
    children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <EdgeStoreProvider>
        <TooltipProvider>

      <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      >
        {children}
      </ThemeProvider>
        </TooltipProvider>
      </EdgeStoreProvider>
    </SessionProvider>
  )
}
