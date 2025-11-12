import fs from "fs";
import path from "path";
import Image from "next/image";

export default function GalleryGrid() {
  const dir = path.join(process.cwd(), "public", "images", "gallery");
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) =>
        [".svg", ".jpg", ".jpeg", ".png", ".webp"].some((ext) => f.toLowerCase().endsWith(ext))
      )
    : [];

  // Standard dimensions for gallery images (aspect ratio ~16:9)
  const imageWidth = 400;
  const imageHeight = 220;

  return (
    <section className="container py-12">
      <h2 className="font-serif text-2xl">Recent Work</h2>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((f) => (
          <div key={f} className="rounded-xl overflow-hidden shadow-soft bg-white">
            <Image
              src={"/images/gallery/" + f}
              alt={`Kitchen and bath project by Rite Kitchen & Bath - ${f.replace(/\.(svg|jpg|jpeg|png|webp)$/i, "").replace(/[-_]/g, " ")}`}
              width={imageWidth}
              height={imageHeight}
              className="w-full h-[220px] object-cover transition-transform duration-300 hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        ))}
        {files.length === 0 &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-soft bg-white">
              <div 
                className="w-full h-[220px] flex items-center justify-center bg-wood-100 text-wood-700"
                role="img"
                aria-label={`Gallery placeholder image ${i + 1} - Example of kitchen or bath cabinetry work by Rite Kitchen & Bath`}
              >
                Gallery Placeholder {i + 1}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}
