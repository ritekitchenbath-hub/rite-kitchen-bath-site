import VideoHero from '@/components/VideoHero';
import GalleryGrid from '@/components/GalleryGrid';

export default function HomePage() {
  return (
    <>
      <VideoHero />
      <section className='container py-12'>
        <h2 className='font-serif text-2xl'>What We Do</h2>
        <p className='mt-3 text-gray-700 max-w-2xl'>
          We specialize in cabinetry, cabinet refacing, and professional finishing. We handle hardware, trim, and clean installs with careful prep and protection.
        </p>
      </section>
      <GalleryGrid />
    </>
  );
}
