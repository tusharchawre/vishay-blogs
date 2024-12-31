"use client"

import { signIn, useSession } from 'next-auth/react'
import React from 'react'
import { Navbar } from './_components/Navbar'

function page() {


  return (
    <div>
      <Navbar />
    </div>
  )
}

export default page