'use client';

import Link from 'next/link';
import RegisterForm from '../components/RegisterForm';
import Button from '../components/Button';

export default function RegisterPage() {
  return (
    <div className="paw-pattern-bg flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 px-4">
      {/* Conteúdo */}
      <div className="relative z-10">
        <RegisterForm />
      </div>

      {/* Link para voltar à home */}
      <div className="absolute top-4 left-4">
        <Link href="/login" className="flex items-center">
          <Button variant="primary" className="px-3!">
            <svg
              className="h-5 w-5"
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
