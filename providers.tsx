"use client"
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import {
  RecoilRoot,
} from 'recoil';
import { EdgeStoreProvider } from './lib/edgestore';


export default function Providers({children}:{
    children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <EdgeStoreProvider>
        {children}
      </EdgeStoreProvider>
    </SessionProvider>
  )
}
