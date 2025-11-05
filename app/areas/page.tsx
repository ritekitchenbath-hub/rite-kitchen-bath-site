export const metadata = {
  title: "Service Areas: Bradenton & Palmetto, FL | Rite Kitchen & Bath",
  description: "Serving Bradenton, Palmetto, Ellenton, Parrish, Terra Ceia, and West Bradenton, FL. Premium kitchen and bath cabinetry services."
};

export default function AreasPage() {
  return (
    <div className='container py-12'>
      <h1 className='font-serif text-3xl'>Service Areas</h1>
      <ul className='mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700'>
        <li>Bradenton</li><li>Palmetto</li><li>Ellenton</li>
        <li>Parrish</li><li>Terra Ceia</li><li>West Bradenton</li>
      </ul>
    </div>
  );
}
