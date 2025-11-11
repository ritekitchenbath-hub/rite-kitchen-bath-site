'use client';

import Link from 'next/link';

export default function StickyCTA() {
  return (
    <div className='fixed bottom-0 inset-x-0 z-40 md:hidden'>
      <div className='mx-3 mb-3 rounded-xl2 shadow-soft overflow-hidden grid grid-cols-2'>
        <a 
          href='tel:+19411111111' 
          className='bg-white py-3 text-center font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-wood-700'
          aria-label='Call us at 941-111-1111'
        >
          Call
        </a>
        <Link 
          href='/contact' 
          className='bg-brand-500 py-3 text-center text-white font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-white'
          aria-label='Get a free consultation'
        >
          Consult
        </Link>
      </div>
    </div>
  );
}
