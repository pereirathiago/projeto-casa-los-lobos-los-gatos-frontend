'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Button from '../components/Button';
import RegisterForm from '../components/RegisterForm';
import { authService } from '../services/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verificar autenticação imediatamente
    if (authService.isAuthenticated()) {
      toast.info('Você já está conectado! Redirecionando...');
      router.replace('/dashboard');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Não renderizar nada enquanto verifica ou está redirecionando
  if (isChecking) {
    return null;
  }

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
