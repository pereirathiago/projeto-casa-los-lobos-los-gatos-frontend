'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth';
import AdminDashboard from '../components/AdminDashboard';
import PadrinhoDashboard from '../components/PadrinhoDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Carregar dados do usuário
    const userData = authService.getUser();
    setUser(userData);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--ong-purple)] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Renderizar dashboard baseado no role
  if (user?.role === 'admin') {
    return <AdminDashboard user={user} />;
  }

  return <PadrinhoDashboard user={user} />;
}
