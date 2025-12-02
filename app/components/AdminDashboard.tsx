'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/icons/logo-ong.svg';
import {
  AdminDashboard as AdminDashboardData,
  apiService,
} from '../services/api';
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

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(
    null,
  );
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = authService.getToken();
        if (!token) {
          toast.error('Sessão expirada. Faça login novamente.');
          router.push('/login');
          return;
        }

        const data = await apiService.getAdminDashboard(token);
        setDashboardData(data);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Erro ao carregar estatísticas do dashboard',
        );
      } finally {
        setIsLoadingStats(false);
      }
    }

    loadStats();
  }, [router]);

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
                  {dashboardData?.animals.total ?? 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {dashboardData?.animals.active ?? 0} ativos
                </p>
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
                  {dashboardData?.sponsors.active ?? 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  de {dashboardData?.sponsors.total ?? 0} cadastrados
                </p>
              </>
            )}
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Apadrinhamentos
              </h3>
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            {isLoadingStats ? (
              <div className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
            ) : (
              <>
                <p className="text-3xl font-bold text-[var(--ong-purple)]">
                  {dashboardData?.sponsorships.totalActive ?? 0}
                </p>
                <p className="mt-1 text-sm text-gray-500">Ativos no momento</p>
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
                  R${' '}
                  {(dashboardData?.donations.month.total ?? 0).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {dashboardData?.donations.thisMonth ?? 0} doações este mês
                </p>
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Ações Rápidas
          </h3>

          {/* Cadastros */}
          <div className="mb-4">
            <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
              Cadastros
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <CardButton
                onClick={() => router.push('/animals')}
                title="Gerenciar Animais"
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
                onClick={() => router.push('/sponsors')}
                title="Gerenciar Padrinhos"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
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
            </div>
          </div>

          {/* Financeiro */}
          <div className="mb-4">
            <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
              Financeiro
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CardButton
                onClick={() => router.push('/sponsorships')}
                title="Gerenciar Apadrinhamentos"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </CardButton>
              <CardButton
                onClick={() => router.push('/donations')}
                title="Gerenciar Doações"
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </CardButton>
            </div>
          </div>

          {/* Minha Conta */}
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
              Minha Conta
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Top Animals */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
              Top 5 Animais Mais Apadrinhados
            </h3>
            {isLoadingStats ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 w-full animate-pulse rounded bg-gray-200"
                  ></div>
                ))}
              </div>
            ) : dashboardData?.topAnimals &&
              dashboardData.topAnimals.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.topAnimals.map((animal, index) => (
                  <div
                    key={animal.uuid}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ong-purple)] text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {animal.name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {animal.type === 'dog' ? 'Cachorro' : 'Gato'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--ong-purple)]">
                        {animal.sponsorshipCount}
                      </p>
                      <p className="text-xs text-gray-500">padrinhos</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-gray-500">
                Nenhum dado disponível
              </p>
            )}
          </div>

          {/* Top Sponsors */}
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
              Top 5 Padrinhos Contribuintes
            </h3>
            {isLoadingStats ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 w-full animate-pulse rounded bg-gray-200"
                  ></div>
                ))}
              </div>
            ) : dashboardData?.topSponsors &&
              dashboardData.topSponsors.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.topSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.uuid}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--ong-orange)] text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {sponsor.name}
                        </p>
                        <p className="text-xs text-gray-500">{sponsor.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[var(--ong-orange)]">
                        R${' '}
                        {sponsor.totalDonations.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500">total doado</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-gray-500">
                Nenhum dado disponível
              </p>
            )}
          </div>
        </div>

        {/* Donation Stats */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Estatísticas de Doações
          </h3>
          {isLoadingStats ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 w-full animate-pulse rounded bg-gray-200"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border-2 border-gray-200 p-4">
                <p className="mb-1 text-sm text-gray-600">Total Geral</p>
                <p className="text-2xl font-bold text-[var(--ong-purple)]">
                  R${' '}
                  {(dashboardData?.donations.general.total ?? 0).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {dashboardData?.donations.total ?? 0} doações • Média: R${' '}
                  {(
                    dashboardData?.donations.general.average ?? 0
                  ).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="rounded-lg border-2 border-gray-200 p-4">
                <p className="mb-1 text-sm text-gray-600">Este Ano</p>
                <p className="text-2xl font-bold text-[var(--ong-orange)]">
                  R${' '}
                  {(dashboardData?.donations.year.total ?? 0).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Média: R${' '}
                  {(dashboardData?.donations.year.average ?? 0).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </p>
              </div>
              <div className="rounded-lg border-2 border-gray-200 p-4">
                <p className="mb-1 text-sm text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-[var(--ong-purple)]">
                  R${' '}
                  {(dashboardData?.donations.week.total ?? 0).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Média: R${' '}
                  {(dashboardData?.donations.week.average ?? 0).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </p>
              </div>
              <div className="rounded-lg border-2 border-gray-200 p-4">
                <p className="mb-1 text-sm text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-[var(--ong-orange)]">
                  R${' '}
                  {(dashboardData?.donations.day.total ?? 0).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Média: R${' '}
                  {(dashboardData?.donations.day.average ?? 0).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
