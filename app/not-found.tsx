'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from './components/Button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-orange-50 px-4">
      <div className="w-full max-w-2xl text-center">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-[var(--ong-purple)] sm:text-[12rem]">
            404
          </h1>
        </div>

        {/* Emoji de gatinho perdido */}
        <div className="mb-6 text-6xl sm:text-8xl">🐱❓</div>

        {/* Mensagem */}
        <div className="mb-8">
          <h2 className="mb-3 text-2xl font-bold text-gray-800 sm:text-3xl">
            Página não encontrada
          </h2>
          <p className="text-base text-gray-600 sm:text-lg">
            Parece que este gatinho se perdeu... <br />A página que você está
            procurando não existe ou foi movida.
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="w-full sm:w-auto"
          >
            ← Voltar
          </Button>
          <Button
            onClick={() => router.push('/')}
            variant="primary"
            className="w-full sm:w-auto"
          >
            🏠 Ir para Home
          </Button>
        </div>

        {/* Links úteis */}
        <div className="mt-12 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Páginas que você pode estar procurando:
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="rounded-lg border-2 border-gray-200 p-3 text-left transition-all hover:border-[var(--ong-purple)] hover:bg-purple-50"
            >
              <div className="mb-1 text-2xl">🏠</div>
              <div className="font-semibold text-gray-800">Página Inicial</div>
              <div className="text-xs text-gray-500">
                Conheça nosso trabalho
              </div>
            </Link>
            <Link
              href="/login"
              className="rounded-lg border-2 border-gray-200 p-3 text-left transition-all hover:border-[var(--ong-purple)] hover:bg-purple-50"
            >
              <div className="mb-1 text-2xl">🔐</div>
              <div className="font-semibold text-gray-800">Login</div>
              <div className="text-xs text-gray-500">Acesse sua conta</div>
            </Link>
            <Link
              href="/register"
              className="rounded-lg border-2 border-gray-200 p-3 text-left transition-all hover:border-[var(--ong-purple)] hover:bg-purple-50"
            >
              <div className="mb-1 text-2xl">📝</div>
              <div className="font-semibold text-gray-800">Cadastro</div>
              <div className="text-xs text-gray-500">Crie uma conta</div>
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border-2 border-gray-200 p-3 text-left transition-all hover:border-[var(--ong-purple)] hover:bg-purple-50"
            >
              <div className="mb-1 text-2xl">📊</div>
              <div className="font-semibold text-gray-800">Dashboard</div>
              <div className="text-xs text-gray-500">Área do usuário</div>
            </Link>
          </div>
        </div>

        {/* Contato */}
        <p className="mt-4 text-sm text-gray-500">
          Precisa de ajuda?{' '}
          <a
            href="mailto:contato@casaloslobos.com"
            className="font-medium text-[var(--ong-purple)] hover:underline"
          >
            Entre em contato
          </a>
        </p>
      </div>
    </div>
  );
}
