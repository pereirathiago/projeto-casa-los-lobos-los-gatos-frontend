'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '../assets/icons/logo-ong.svg';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import Button from './Button';
import CardButton from './CardButton';

interface AdminDashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    is_master?: boolean;
  };
}

interface DashboardStats {
  totalAnimals: number;
  totalSponsors: number;
  monthlyAdoptions: number;
  monthlyDonations: string;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalAnimals: 0,
    totalSponsors: 0,
    monthlyAdoptions: 0,
    monthlyDonations: 'R$ 0',
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = authService.getToken();
        if (!token) return;

        // Buscar animais totais (dado real disponível)
        const animals = await apiService.getAnimals();

        setStats({
          totalAnimals: animals.length,
          // Dados mockup (aguardando endpoints do backend)
          totalSponsors: 28,
          monthlyAdoptions: 12,
          monthlyDonations: 'R$ 12.5k',
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setIsLoadingStats(false);
      }
    }

    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        await apiService.logout(token);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      authService.clearAuth();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={140}
                height={70}
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-2xl font-bold text-[var(--ong-purple)]">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Painel de Administração - Gerencie os animais, padrinhos e doações
            da ONG.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Animais Totais
              </h3>
              <svg
                className="h-8 w-8 text-[var(--ong-purple)]"
                viewBox="0 0 48.839 48.839"
                fill="currentColor"
              >
                <path d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252 c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373 c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742 c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181 C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0 S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971 s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878 c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414 S48.455,16.861,45.727,15.602z" />
              </svg>
            </div>
            {isLoadingStats ? (
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-[var(--ong-purple)]">
                  {stats.totalAnimals}
                </p>
                <p className="mt-1 text-sm text-gray-500">Sob cuidado da ONG</p>
              </>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Padrinhos</h3>
              <svg
                className="h-8 w-8 text-[var(--ong-orange)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            {isLoadingStats ? (
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-[var(--ong-orange)]">
                  {stats.totalSponsors}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Contribuindo ativamente
                </p>
                <p className="mt-1 text-xs text-gray-400 italic">(mockup)</p>
              </>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Adoções</h3>
              <svg
                className="h-8 w-8 text-[var(--ong-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {isLoadingStats ? (
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-[var(--ong-purple)]">
                  {stats.monthlyAdoptions}
                </p>
                <p className="mt-1 text-sm text-gray-500">Este mês</p>
                <p className="mt-1 text-xs text-gray-400 italic">(mockup)</p>
              </>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Doações</h3>
              <svg
                className="h-8 w-8 text-[var(--ong-orange)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {isLoadingStats ? (
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-[var(--ong-orange)]">
                  {stats.monthlyDonations}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Arrecadado este mês
                </p>
                <p className="mt-1 text-xs text-gray-400 italic">(mockup)</p>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <CardButton
              onClick={() => router.push('/animals')}
              title="Gerenciar animais"
            >
              <svg
                className="mb-2 h-8 w-8 justify-center text-[var(--ong-purple)]"
                viewBox="0 0 48.839 48.839"
                fill="currentColor"
              >
                <path d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252 c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373 c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742 c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181 C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0 S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971 s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878 c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414 S48.455,16.861,45.727,15.602z" />
              </svg>
            </CardButton>
            <CardButton
              onClick={() => router.push('/profile')}
              title="Ver Perfil"
            >
              <svg
                className="mb-2 h-8 w-8 justify-self-center text-[var(--ong-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </CardButton>
            {user?.is_master && (
              <CardButton
                onClick={() => router.push('/admin')}
                title="Gerenciar Admins"
              >
                <svg
                  className="mb-2 h-8 w-8 justify-self-center text-[var(--ong-purple)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </CardButton>
            )}
            <CardButton
              onClick={() => router.push('/sponsors')}
              title="Gerenciar padrinhos"
            >
              <svg
                className="mb-2 h-8 w-8 justify-self-center text-[var(--ong-orange)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </CardButton>
            <CardButton
              title="Relatórios"
              onClick={() => router.push('/reports')}
            >
              <svg
                className="mb-2 h-8 w-8 justify-self-center text-[var(--ong-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </CardButton>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Atividades Recentes
          </h3>
          <div className="space-y-4">
            <div className="flex items-start border-l-4 border-[var(--ong-purple)] bg-purple-50 p-3">
              <svg
                className="mr-3 h-6 w-6 flex-shrink-0 text-[var(--ong-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">
                  Novo animal resgatado
                </p>
                <p className="text-sm text-gray-600">
                  Max, um labrador de 2 anos, foi resgatado hoje.
                </p>
                <p className="mt-1 text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-[var(--ong-orange)] bg-orange-50 p-3">
              <svg
                className="mr-3 h-6 w-6 flex-shrink-0 text-[var(--ong-orange)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">
                  Novo padrinho cadastrado
                </p>
                <p className="text-sm text-gray-600">
                  Maria Silva se tornou madrinha do Rex.
                </p>
                <p className="mt-1 text-xs text-gray-500">Há 5 horas</p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-[var(--ong-purple)] bg-purple-50 p-3">
              <svg
                className="mr-3 h-6 w-6 flex-shrink-0 text-[var(--ong-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Animal adotado</p>
                <p className="text-sm text-gray-600">
                  Bella foi adotada pela família Santos.
                </p>
                <p className="mt-1 text-xs text-gray-500">Ontem</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
