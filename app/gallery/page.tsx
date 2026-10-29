import GalleryGrid from "@/components/GalleryGrid";
import CtaBand from "@/components/CtaBand";

export const metadata = {
  title: "Kitchen Cabinet & Bathroom Vanity Gallery",
  description:
    "Browse dark shaker kitchen cabinet photos from Rite Kitchen & Bath in Bradenton, Sarasota, St. Petersburg & Parrish, FL.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <section className="container pt-12">
        <h1 className="font-serif text-3xl md:text-4xl">Project Gallery</h1>
        <p className="mt-3 max-w-3xl text-gray-700">
          Dark shaker cabinets from a recent kitchen. Tap any photo to view it larger.
        </p>
      </section>
      <GalleryGrid title="Kitchens & Baths" />
      <CtaBand title="Like what you see?" />
    </>
  );
}
