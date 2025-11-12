"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface GalleryLightboxProps {
  files: string[];
  startIndex: number;
  onClose: () => void;
  captions?: Record<string, string>;
}

export default function GalleryLightbox({
  files,
  startIndex,
  onClose,
  captions,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
        return;
      }

      // Focus trap: Tab should cycle within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [files.length, onClose]);

  // Update current index when startIndex changes
  useEffect(() => {
    setCurrentIndex(startIndex);
  }, [startIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentFile = files[currentIndex];
  const caption =
    captions?.[currentFile] ||
    currentFile
      ?.replace(/\.(svg|jpg|jpeg|png|webp)$/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) || "";

  const transitionClass = prefersReducedMotion ? "" : "transition-all duration-200";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project photo viewer"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      ref={modalRef}
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-ink-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-wood-500 focus:ring-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous button */}
      {files.length > 1 && (
        <button
          onClick={handlePrev}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 text-ink-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-wood-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {files.length > 1 && (
        <button
          onClick={handleNext}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 p-3 text-ink-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-wood-500 focus:ring-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {currentFile && (
            <Image
              src={`/images/gallery/${currentFile}`}
              alt={`Kitchen and bath project by Rite Kitchen & Bath — ${caption}`}
              fill
              className={`object-contain ${transitionClass}`}
              sizes="100vw"
              priority
            />
          )}
        </div>

        {/* Caption */}
        {caption && (
          <div className="mt-4 text-center text-white/90 text-sm md:text-base max-w-2xl">
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}

