'use client';

import Link from 'next/link';
import LoginForm from '../components/LoginForm';
import Button from '../components/Button';

export default function LoginPage() {
  return (
    <div className="paw-pattern-bg flex min-h-screen items-center justify-center px-4">
      {/* Conteúdo */}
      <div className="relative z-10">
        <LoginForm />
      </div>

      {/* Link para voltar à home */}
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center">
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
