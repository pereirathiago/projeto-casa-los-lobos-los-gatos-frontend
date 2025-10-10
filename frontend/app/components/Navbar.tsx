'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import logo from '../assets/icons/logo-ong.svg';
import Link from 'next/link';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 810) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    <Link
      key="sobre"
      href="#sobre"
      className="block px-4 py-2 text-white transition-colors hover:text-white/80 max-[810px]:text-white min-[810px]:p-0 min-[810px]:text-[24px] min-[810px]:font-bold"
    >
      Sobre
    </Link>,
    <Link
      key="como-atuamos"
      href="#como-atuamos"
      className="block px-4 py-2 text-white transition-colors hover:text-white/80 max-[810px]:text-white min-[810px]:p-0 min-[810px]:text-[24px] min-[810px]:font-bold"
    >
      Como atuamos
    </Link>,
    <Link
      key="como-ajudar"
      href="#como-ajudar"
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
    <nav className="absolute top-0 z-50 w-full bg-transparent max-sm:bg-transparent min-[1120px]:bg-transparent sm:bg-[#CD6B16]">
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
              className="rounded-md bg-transparent p-2 text-white focus:outline-none max-[810px]:text-white"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg
                className="h-8 w-8"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="min-[810px]:hidden" id="mobile-menu">
          <div className="space-y-1 bg-[#CD6B16] px-2 pt-2 pb-3 sm:px-3">
            {navLinks.slice(0, 3)}
          </div>
        </div>
      )}
    </nav>
  );
}
