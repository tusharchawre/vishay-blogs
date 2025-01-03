import React from 'react'

export function Gradient() {
  return (
    <div className='absolute z-0 w-full h-full bg-transparent'>
        <div className='w-[500px] h-[500px] bg-[#C796C4]/60 dark:bg-[#D0A7CDA1] rounded-full absolute blur-[130px] -bottom-52 -left-52' />
        <div className='w-[300px] h-[300px] bg-[#85C0D085] dark:bg-[#98C9D785] rounded-full absolute blur-[125px] top-12 right-80' />
    </div>
  )
}

