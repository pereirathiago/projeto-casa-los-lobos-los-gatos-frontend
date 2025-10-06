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
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    <Link key="sobre" href="#sobre" className="block px-4 py-2 max-[615px]:text-white text-white transition-colors hover:text-white/80 md:text-[24px] md:font-bold md:p-0">
      Sobre
    </Link>,
    <Link key="como-atuamos" href="#como-atuamos" className="block px-4 py-2 max-[615px]:text-white text-white transition-colors hover:text-white/80 md:text-[24px] md:font-bold md:p-0">
      Como atuamos
    </Link>,
    <Link key="como-ajudar" href="#como-ajudar" className="block px-4 py-2 max-[615px]:text-white text-white transition-colors hover:text-white/80 md:text-[24px] md:font-bold md:p-0">
      Como ajudar
    </Link>,
    <Link key="entrar" href="/login" className="mt-4 md:mt-0 md:ml-4 rounded-lg bg-[var(--ong-purple)] px-6 py-2 text-[20px] font-bold text-white transition-all hover:opacity-90">
      Entrar
    </Link>
  ];

  return (
    <nav
      className="absolute top-0 w-full z-50 bg-[#CD6B16] min-[1120px]:bg-transparent max-[615px]:bg-[#CD6B16]"
    >

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:pl-8 lg:pr-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos Los Gatos"
                width={140}
                height={70}
                priority
              />
            </a>
          </div>

          <div className="hidden md:flex items-baseline space-x-8">
            {navLinks}
          </div>

          <div className="flex md:hidden">
            <Link href="/login" className="mt-4 md:mt-0 md:ml-4 rounded-lg bg-[var(--ong-purple)] px-6 py-2 text-[20px] font-bold text-white transition-all hover:opacity-90">
              Entrar
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="rounded-md bg-transparent p-2 text-white max-[615px]:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}

              </svg>
            </button>
          </div>
        </div>
      </div>

      

      {isOpen && (
        <>

          <div className="md:hidden" id="mobile-menu">

            <div className="space-y-1 bg-[#CD6B16] px-2 pt-2 pb-3 sm:px-3">
                {navLinks.slice(0, 3)}
            </div>
          </div>
        </>
      )}
    </nav>

  );
}