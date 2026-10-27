"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GalleryLightbox from "./GalleryLightbox";

export type GalleryItem = { file: string; caption: string; alt: string };

export default function GalleryGridClient({ items, title }: { items: GalleryItem[]; title: string }) {
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

  const files = items.map((i) => i.file);
  const captions = Object.fromEntries(items.map((i) => [i.file, i.caption]));

  return (
    <>
      <section className="container py-12">
        <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <button
              key={item.file}
              type="button"
              className="group text-left rounded-xl overflow-hidden shadow-soft bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wood-500 focus-visible:ring-offset-2"
              onClick={() => setLightbox({ open: true, index })}
              aria-label={"View larger: " + item.caption}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={"/images/gallery/" + item.file}
                  alt={item.alt}
                  fill
                  className={`object-cover ${prefersReducedMotion ? "" : "transition-transform duration-300 group-hover:scale-[1.03]"}`}
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                />
              </div>
              <p className="px-4 py-3 text-sm text-gray-700">{item.caption}</p>
            </button>
          ))}
        </div>
      </section>

      {lightbox.open && items.length > 0 && (
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
