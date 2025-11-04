import Image from 'next/image';
import fs from 'fs';
import path from 'path';

export default function GalleryGrid() {
  // static read of placeholder images (safe with App Router on build)
  const dir = path.join(process.cwd(), 'public', 'images', 'gallery');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
  return (
    <section className='container py-12'>
      <h2 className='font-serif text-2xl'>Recent Work</h2>
      <div className='mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {files.map((f) => (
          <img key={f} src={/images/gallery/} alt='Project photo' className='w-full h-auto rounded-xl2 shadow-soft' />
        ))}
      </div>
    </section>
  );
}
