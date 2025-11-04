'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) setStatus('success'); else setStatus('error');
  }

  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium'>Name</label>
        <input required name='name' className='mt-1 w-full rounded-md border border-brand-200 px-3 py-2' />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm font-medium'>Email</label>
          <input required type='email' name='email' className='mt-1 w-full rounded-md border border-brand-200 px-3 py-2' />
        </div>
        <div>
          <label className='block text-sm font-medium'>Phone</label>
          <input name='phone' className='mt-1 w-full rounded-md border border-brand-200 px-3 py-2' />
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium'>Message</label>
        <textarea required name='message' rows={4} className='mt-1 w-full rounded-md border border-brand-200 px-3 py-2'></textarea>
      </div>

      <button disabled={status==='sending'} className='rounded-md bg-brand-500 px-4 py-2 text-white'>
        {status==='sending' ? 'Sending…' : 'Send Message'}
      </button>

      {status==='success' && <p className='text-green-700'>Thanks! We’ll be in touch shortly.</p>}
      {status==='error' && <p className='text-red-700'>Something went wrong. Please try again.</p>}
    </form>
  );
}
