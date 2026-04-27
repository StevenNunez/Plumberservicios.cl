'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/#servicios' },
    { label: 'Proyectos', href: '/proyectos' },
    { label: 'Nosotros', href: '/#nosotros' },
    { label: 'Contacto', href: '/#contacto' },
  ];

  return (
    <header className="bg-[#111111] text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img
            alt="Logo Plumber Servicios SPA"
            className="h-12 md:h-16 w-auto object-contain mix-blend-lighten"
            src="/logohe.png"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm industrial-font">
          {navLinks.map(({ label, href }) => {
            const isActive =
              href === '/'
                ? pathname === '/'
                : pathname.startsWith(href.replace('/#', '/'));
            return (
              <Link
                key={label}
                href={href}
                className={`hover:text-[var(--primary)] transition-colors border-b-2 ${isActive
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent hover:border-[var(--primary)]'
                  }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <a
            className="bg-[var(--primary)] text-[var(--black)] px-3 md:px-5 py-2 rounded-sm font-bold text-xs md:text-sm industrial-font hover:bg-white transition-all text-center leading-tight"
            href="https://wa.me/56952235696?text=Hola,%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n/presupuesto.%20Vengo%20desde%20https://plumberservicios.cl"
          >
            Presupuesto
          </a>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-[var(--primary)] transition-colors p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined text-3xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-[#1a1a1a] border-t border-gray-800">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map(({ label, href }) => {
              const isActive =
                href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(href.replace('/#', '/'));
              return (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg industrial-font transition-colors ${isActive
                    ? 'text-[var(--primary)]'
                    : 'text-white hover:text-[var(--primary)]'
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
