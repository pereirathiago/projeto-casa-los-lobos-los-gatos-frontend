'use client';

import Link from 'next/link';
import Button from '../components/Button';
import RegisterForm from '../components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="paw-pattern-bg flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 px-4 py-20 sm:py-12">
      {/* Conteúdo */}
      <div className="relative z-10 w-full">
        <RegisterForm />
      </div>

      {/* Link para voltar à home */}
      <div className="absolute top-3 left-3 z-50 sm:top-4 sm:left-4">
        <Link href="/login" className="flex items-center">
          <Button variant="primary" className="px-3 py-2 sm:px-4 sm:py-3">
            <svg
              className="h-4 w-4 sm:h-5 sm:w-5"
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
          </Button>
        </Link>
      </div>
    </div>
  );
}
