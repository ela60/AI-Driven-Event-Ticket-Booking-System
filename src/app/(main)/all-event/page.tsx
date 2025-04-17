import CodingExpert from '@/components/AllEvent/CodingExpert'
import OutComes from '@/components/AllEvent/OutComes'
import React from 'react'

export default function page() {
  return (
    <div className='container mx-auto flex flex-col items-center justify-center my-8'> 
      <OutComes></OutComes>
      <CodingExpert></CodingExpert>
    </div>
  )
}
