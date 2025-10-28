'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import logo from '../assets/icons/logo-ong.svg';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 810) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const navLinks = [
    <Link
      key="sobre"
      href="#sobre"
      onClick={() => setIsOpen(false)}
      className="block px-4 py-2 text-white transition-colors hover:text-white/80 max-[810px]:text-white min-[810px]:p-0 min-[810px]:text-[24px] min-[810px]:font-bold"
    >
      Sobre
    </Link>,
    <Link
      key="como-atuamos"
      href="#como-atuamos"
      onClick={() => setIsOpen(false)}
      className="block px-4 py-2 text-white transition-colors hover:text-white/80 max-[810px]:text-white min-[810px]:p-0 min-[810px]:text-[24px] min-[810px]:font-bold"
    >
      Como atuamos
    </Link>,
    <Link
      key="como-ajudar"
      href="#como-ajudar"
      onClick={() => setIsOpen(false)}
      className="block px-4 py-2 text-white transition-colors hover:text-white/80 max-[810px]:text-white min-[810px]:p-0 min-[810px]:text-[24px] min-[810px]:font-bold"
    >
      Como ajudar
    </Link>,
    <Link
      key="entrar"
      href="/login"
      className="rounded-lg bg-[var(--ong-purple)] px-6 py-2 text-[20px] font-bold text-white transition-all hover:opacity-90 min-[810px]:mt-0 min-[810px]:ml-4"
    >
      Entrar
    </Link>,
  ];

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#CD6B16]/60 shadow-lg backdrop-blur-md'
          : 'bg-transparent max-sm:bg-transparent sm:bg-[#CD6B16] lg:bg-transparent'
      } ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:pr-4 lg:pl-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos Los Gatos"
                width={140}
                height={70}
                priority
              />
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-baseline space-x-8 min-[810px]:flex">
            {navLinks}
          </div>

          {/* Mobile nav: hamburger + login */}
          <div className="flex min-[810px]:hidden">
            {navLinks[3]}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="relative z-50 h-12 w-12 rounded-md bg-transparent p-2 text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <span
                  aria-hidden="true"
                  className={`block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${
                    isOpen ? 'rotate-45' : '-translate-y-1.5'
                  }`}
                ></span>
                <span
                  aria-hidden="true"
                  className={`block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${
                    isOpen ? 'opacity-0' : ''
                  }`}
                ></span>
                <span
                  aria-hidden="true"
                  className={`block h-0.5 w-6 transform bg-current transition duration-300 ease-in-out ${
                    isOpen ? '-rotate-45' : 'translate-y-1.5'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="min-[810px]:hidden" id="mobile-menu">
        {/* Dropdown for sm screens (orange background) with slide-down animation */}
        <div className="hidden sm:block">
          <div
            className={`overflow-hidden bg-[#CD6B16] transition-all duration-300 ease-out ${
              isOpen
                ? 'max-h-48 translate-y-0 opacity-100'
                : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
            }`}
          >
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navLinks.slice(0, 3)}
            </div>
          </div>
        </div>

        {/* Side menu for xs screens */}
        <div className="sm:hidden">
          <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          ></div>
          <div
            className={`fixed top-0 right-0 bottom-0 z-50 w-3/4 max-w-sm p-6 shadow-2xl transition-all duration-300 ease-in-out ${
              isOpen
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0'
            }`}
            style={{ backgroundColor: '#CD6B16' }}
          >
            <div className="mt-16 space-y-4">{navLinks.slice(0, 3)}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
