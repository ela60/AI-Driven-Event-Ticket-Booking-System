import Image from 'next/image';
import React from 'react';

export default function CodingExpert() {
  return (
    <div className='w-full flex flex-col lg:flex-row items-center bg-gradient-to-r from-purple-800 to-pink-600 text-white p-10 rounded-2xl shadow-lg'>
    <div className='lg:w-1/2 w-full'>
      <Image 
        src='/image/img1.jpg' 
        alt='Event Audience'
        width={600} 
        height={400} 
        className='rounded-xl shadow-md'
      />
    </div>
    <div className='lg:w-1/2 w-full lg:pl-10 text-center lg:text-left'>
      <h2 className='text-3xl font-bold mb-4'>Shift your perspective on digital business</h2>
      <p className='text-lg'>
        How you transform your business as technology, consumer habits, and industry dynamics change? 
        Find out from those leading the charge.
      </p>
    </div>
  </div>
  );
}