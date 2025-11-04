"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/areas", label: "Areas" },
  { href: "/gallery", label: "Gallery" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route click
  function handleNavClick() {
    setOpen(false);
  }

  return (
    <header className={"sticky top-0 z-50 bg-white " + (scrolled ? "shadow-soft " : "") + "border-b border-brand-100"}>
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" aria-label="Rite Kitchen & Bath home" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-brand-500" aria-hidden />
          <span className="font-semibold tracking-tight text-brand-900">Rite Kitchen &amp; Bath</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium hover:text-brand-500">
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="inline-flex items-center rounded-md bg-brand-500 px-4 py-2 text-white hover:opacity-95">
            Free Consult
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-200"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {/* Icon */}
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            {open ? (
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        className={
          "md:hidden overflow-hidden border-t border-brand-100 bg-white transition-[max-height] duration-300 " +
          (open ? "max-h-96" : "max-h-0")
        }
      >
        <nav className="container py-4 flex flex-col gap-3">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={handleNavClick} className="py-1 text-base hover:text-brand-500">
              {n.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={handleNavClick}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-brand-500 px-4 py-2 text-white"
          >
            Free Consult
          </Link>
        </nav>
      </div>
    </header>
  );
}
