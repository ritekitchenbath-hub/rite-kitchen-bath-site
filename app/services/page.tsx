export default function ServicesPage() {
  return (
    <div className='container py-12'>
      <h1 className='font-serif text-3xl'>Services</h1>
      <ul className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <li className='bg-white p-6 rounded-xl2 shadow-soft'>
          <h3 className='font-semibold'>Cabinet Refacing</h3>
          <p className='text-gray-600 mt-2'>New doors & drawer fronts, updated hardware, modern look without full tear-out.</p>
        </li>
        <li className='bg-white p-6 rounded-xl2 shadow-soft'>
          <h3 className='font-semibold'>Custom Cabinetry & Finishing</h3>
          <p className='text-gray-600 mt-2'>Shop-finished or on-site finishing with durable coatings and clean masking.</p>
        </li>
        <li className='bg-white p-6 rounded-xl2 shadow-soft'>
          <h3 className='font-semibold'>Repairs & Adjustments</h3>
          <p className='text-gray-600 mt-2'>Hinges, slides, alignment, touch-ups, color matching.</p>
        </li>
        <li className='bg-white p-6 rounded-xl2 shadow-soft'>
          <h3 className='font-semibold'>Hardware & Trim</h3>
          <p className='text-gray-600 mt-2'>Pulls/knobs, soft-close upgrades, scribe, crown, and base details.</p>
        </li>
      </ul>
      <p className='mt-8 text-gray-600'>Hours: Mon–Fri 9–5 • Licensed & Insured • FL</p>
    </div>
  );
}
