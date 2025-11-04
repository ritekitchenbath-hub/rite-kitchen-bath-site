import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className='container py-12'>
      <h1 className='font-serif text-3xl'>Get a Free Consultation</h1>
      <p className='text-gray-600 mt-2'>Tell us a bit about your project and we’ll get back quickly.</p>
      <div className='mt-8 max-w-2xl bg-white p-6 rounded-xl2 shadow-soft'>
        <ContactForm />
        <p className='mt-6 text-sm text-gray-600'>Rite Kitchen & Bath • (941) 111-1111 • Bradenton/Palmetto (address placeholder)</p>
      </div>
    </div>
  );
}
