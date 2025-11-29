'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '../assets/icons/logo-ong.svg';
import { authService } from '../services/auth';

interface PublicNavbarProps {
  className?: string;
}

export default function PublicNavbar({ className }: PublicNavbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Verificar se o usuário está logado
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleNavigate = () => {
    if (user) {
      // Redirecionar para o dashboard apropriado baseado no role
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full bg-[#CD6B16] transition-all duration-300 ${className}`}
    >
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

          <div className="flex items-center space-x-4">
            <button
              onClick={handleNavigate}
              className="cursor-pointer rounded-lg bg-[var(--ong-purple)] px-6 py-2 text-[20px] font-bold text-white transition-all hover:opacity-90"
            >
              {user ? 'Voltar ao Dashboard' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
