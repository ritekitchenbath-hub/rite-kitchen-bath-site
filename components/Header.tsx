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

  function handleNavClick() { setOpen(false); }

  return (
    <header className={"sticky top-0 z-50 bg-white " + (scrolled ? "shadow-soft " : "") + "border-b border-wood-200"}>
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" aria-label="RKB home" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-wood-700" aria-hidden />
          <span className="font-semibold tracking-tight">Rite Kitchen &amp; Bath</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium hover:text-wood-700">
              {n.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary">Free Consult</Link>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-wood-300 focus:outline-2 focus:outline-offset-2 focus:outline-wood-700"
          aria-label={open ? "Close menu" : "Open menu"} 
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            {open
              ? <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              : <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      <div className={"md:hidden overflow-hidden border-t border-wood-200 bg-white transition-[max-height] duration-300 " + (open ? "max-h-96" : "max-h-0")}>
        <nav className="container py-4 flex flex-col gap-3">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} onClick={handleNavClick} className="py-1 text-base hover:text-wood-700">
              {n.label}
            </Link>
          ))}
          <Link href="/contact" onClick={handleNavClick} className="btn-primary justify-center mt-2">
            Free Consult
          </Link>
        </nav>
      </div>
    </header>
  );
}
