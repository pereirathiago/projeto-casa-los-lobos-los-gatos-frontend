'use client';

import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 px-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 bg-[var(--ong-purple)]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 bg-[var(--ong-orange)]"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">
        <LoginForm />
      </div>

      {/* Link para voltar à home */}
      <div className="absolute top-4 left-4">
        <a
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
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
        </a>
      </div>
    </div>
  );
}
