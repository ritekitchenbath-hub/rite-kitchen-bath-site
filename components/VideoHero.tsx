export default function VideoHero() {
  return (
    <section className='relative bg-white'>
      <div className='container py-8'>
        <div className='rounded-xl2 overflow-hidden shadow-soft'>
          <video
            className='w-full h-auto'
            autoPlay
            muted
            loop
            playsInline
            poster='/images/hero.jpg'
          >
            <source src='/videos/hero.mp4' type='video/mp4' />
          </video>
        </div>
        <div className='mt-6'>
          <h1 className='font-serif text-3xl md:text-4xl'>Cabinetry, Refacing & Finishing—Done Right.</h1>
          <p className='mt-3 text-gray-600'>Local craft. Clean installs. On time. Serving Bradenton & Palmetto.</p>
        </div>
      </div>
    </section>
  );
}
