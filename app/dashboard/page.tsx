'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import AdminDashboard from '../components/AdminDashboard';
import PadrinhoDashboard from '../components/PadrinhoDashboard';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    is_master?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      // Verificar autenticação
      if (!authService.isAuthenticated()) {
        toast.error('Acesso negado. Por favor, faça login para continuar.');
        router.push('/login');
        return;
      }

      const token = authService.getToken();
      const localUser = authService.getUser();

      // Se for admin, buscar dados atualizados do backend
      if (localUser?.role === 'admin' && token) {
        try {
          const profile = await apiService.getMyProfile(token);
          const updatedUser = {
            id: profile.uuid,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            is_master: profile.is_master,
          };
          setUser(updatedUser);

          // Atualizar dados no storage também
          const rememberMe = localStorage.getItem('rememberMe') === 'true';
          authService.saveAuth(
            {
              token,
              user: updatedUser,
            },
            rememberMe,
          );
        } catch (error) {
          console.error('Erro ao carregar perfil:', error);
          // Em caso de erro, usar dados locais
          setUser(localUser);
        }
      } else {
        // Para padrinhos, usar dados locais
        setUser(localUser);
      }

      setIsLoading(false);
    }

    loadUser();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--ong-purple)]"></div>
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
