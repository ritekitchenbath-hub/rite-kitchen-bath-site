import Link from 'next/link';
import { business } from '@/lib/business';

export default function StickyCTA() {
  return (
    <div className='fixed bottom-0 inset-x-0 z-40 md:hidden'>
      <div className='mx-3 mb-3 rounded-xl2 shadow-soft overflow-hidden grid grid-cols-2'>
        <a 
          href={business.phoneHref}
          className='bg-white py-3 text-center font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-wood-700'
          aria-label={'Call us at ' + business.phone}
        >
          Call
        </a>
        <Link 
          href='/contact' 
          className='bg-wood-700 py-3 text-center text-white font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-white'
          aria-label='Get a free consultation'
        >
          Free Consult
        </Link>
      </div>
    </div>
  );
}
