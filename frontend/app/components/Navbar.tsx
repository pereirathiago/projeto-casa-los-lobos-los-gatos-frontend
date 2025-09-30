import Image from 'next/image';
import React from 'react';
import logo from '../assets/icons/logo-ong.svg';

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  return (
    <nav
      className={`top-0 z-500 w-full bg-transparent shadow-none ${className}`}
    >
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between px-28">
          {/* Logo */}
          <div className="flex-shrink-0 pl-45">
            <div className="flex items-center">
              <Image
                className='z-50'
                src={logo}
                alt="Logo Casa Los Lobos Los Gatos"
                width={140}
                height={70}
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block z-50">
            <div className="flex items-baseline space-x-8">
              <a
                href="#sobre"
                className="text-[24px] text-white font-bold transition-colors hover:text-white/80"
              >
                Sobre
              </a>
              <a
                href="#como-atuamos"
                className="text-[24px] text-white font-bold transition-colors hover:text-white/80"
              >
                Como atuamos
              </a>
              <a
                href="#como-ajudar"
                className="text-[24px] text-white font-bold transition-colors hover:text-white/80"
              >
                Como ajudar
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="rounded-md bg-transparent p-2 text-white hover:bg-white/10 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
