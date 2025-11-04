export default function Footer() {
  return (
    <footer className='mt-24 border-t border-brand-100 bg-white'>
      <div className='container py-10 text-sm text-gray-600 flex flex-col md:flex-row gap-3 md:items-center md:justify-between'>
        <p>© {new Date().getFullYear()} Rite Kitchen & Bath. All rights reserved.</p>
        <p>Phone: <a className='link' href='tel:19411111111'>(941) 111-1111</a></p>
      </div>
    </footer>
  );
}
