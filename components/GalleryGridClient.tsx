"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GalleryLightbox from "./GalleryLightbox";

interface GalleryGridClientProps {
  files: string[];
  captions?: Record<string, string>;
}

export default function GalleryGridClient({ files, captions }: GalleryGridClientProps) {
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleImageClick = (index: number) => {
    setLightbox({ open: true, index });
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleImageClick(index);
    }
  };

  return (
    <>
      <section className="container py-12">
        <h2 className="font-serif text-2xl">Recent Work</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((f, index) => (
            <div
              key={f}
              className="rounded-xl overflow-hidden shadow-soft bg-white cursor-pointer focus-within:ring-2 focus-within:ring-wood-500 focus-within:ring-offset-2 outline-none"
              role="button"
              tabIndex={0}
              onClick={() => handleImageClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`View ${f.replace(/\.(svg|jpg|jpeg|png|webp)$/i, "").replace(/[-_]/g, " ")} in full size`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={"/images/gallery/" + f}
                  alt={`Kitchen and bath project by Rite Kitchen & Bath — ${
                    f
                      .replace(/\.(svg|jpg|jpeg|png|webp)$/i, "")
                      .replace(/[-_]/g, " ")
                      .replace(/\s+/g, " ")
                  }`}
                  fill
                  priority={false}
                  loading="lazy"
                  className={`object-cover ${prefersReducedMotion ? "" : "transition-transform duration-300 hover:scale-[1.02]"}`}
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                />
              </div>
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

      {lightbox.open && files.length > 0 && (
        <GalleryLightbox
          files={files}
          startIndex={lightbox.index}
          onClose={() => setLightbox({ open: false, index: 0 })}
          captions={captions}
        />
      )}
    </>
  );
}

