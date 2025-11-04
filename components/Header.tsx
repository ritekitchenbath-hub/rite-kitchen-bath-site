'use client';

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
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"sticky top-0 z-50 bg-white " + (scrolled ? "shadow-soft " : "") + "border-b border-brand-100"}>
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" aria-label="Rite Kitchen & Bath home" className="flex items-center gap-3">
          <img src="/images/logo.svg" alt="Rite Kitchen & Bath" className="h-8 w-auto" />
        </Link>
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
      </div>
    </header>
  );
}
