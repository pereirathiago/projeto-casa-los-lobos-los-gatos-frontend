'use client';

import Link from 'next/link';
import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 px-4">
      {/* Background decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[var(--ong-purple)] opacity-20"></div>
        <div className="absolute right-10 bottom-20 h-96 w-96 rounded-full bg-[var(--ong-orange)] opacity-20"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        <LoginForm />
      </div>

      {/* Link para voltar à home */}
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="flex items-center text-gray-600 transition-colors hover:text-gray-800"
        >
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar para home
        </Link>
      </div>
    </div>
  );
}
