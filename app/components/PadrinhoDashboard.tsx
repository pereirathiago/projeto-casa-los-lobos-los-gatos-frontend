'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/icons/logo-ong.svg';
import {
  MySponsoredAnimal,
  SponsorDashboard,
  apiService,
} from '../services/api';
import { authService } from '../services/auth';
import { getFullImageUrl } from '../utils/imageUrl';
import Button from './Button';
import CardButton from './CardButton';

interface PadrinhoDashboardProps {
  user: { id: string; name: string; email: string; role: string } | null;
}

export default function PadrinhoDashboard({ user }: PadrinhoDashboardProps) {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<SponsorDashboard | null>(
    null,
  );
  const [sponsoredAnimals, setSponsoredAnimals] = useState<MySponsoredAnimal[]>(
    [],
  );
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(true);
  const [hasNoSponsorships, setHasNoSponsorships] = useState(false);

  const handleWhatsAppContact = (animalName: string) => {
    const phone = '5542988331566';
    const message = encodeURIComponent(
      `Olá! Gostaria de obter mais informações sobre o(a) ${animalName} da Casa Los Lobos e Los Gatos.`,
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  useEffect(() => {
    async function loadData() {
      try {
        const token = authService.getToken();
        if (!token) {
          toast.error('Sessão expirada. Faça login novamente.');
          router.push('/login');
          return;
        }

        // Load dashboard stats
        try {
          const data = await apiService.getSponsorDashboard(token);
          setDashboardData(data);
          setHasNoSponsorships(false);
        } catch (error) {
          console.error('Erro ao carregar estatísticas:', error);
          if (error instanceof Error && error.message.includes('apadrinhe')) {
            setHasNoSponsorships(true);
            toast.info('Você ainda não apadrinou nenhum animal. Comece agora!');
          } else {
            toast.error(
              error instanceof Error
                ? error.message
                : 'Erro ao carregar estatísticas do dashboard',
            );
          }
        } finally {
          setIsLoadingStats(false);
        }

        // Load sponsored animals
        try {
          const animals = await apiService.getMySponsorships(token);
          setSponsoredAnimals(animals);
        } catch (error) {
          console.error('Erro ao carregar animais apadrinhados:', error);
        } finally {
          setIsLoadingAnimals(false);
        }
      } catch (error) {
        console.error('Erro geral:', error);
        setIsLoadingStats(false);
        setIsLoadingAnimals(false);
      }
    }

    loadData();
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

  const getMonthsText = (months: number) => {
    if (months === 0) return 'Novo padrinho';
    if (months === 1) return '1 mês';
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) return years === 1 ? '1 ano' : `${years} anos`;
    return `${years} ${years === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
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
                <p className="text-xs text-gray-500">Padrinho</p>
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
            Olá, {user?.name}!
          </h2>
          <p className="text-gray-600">
            {hasNoSponsorships
              ? 'Seja bem-vindo! Apadrinhe um animal e faça a diferença na vida dele.'
              : 'Obrigado por ser um padrinho/madrinha! Acompanhe aqui seus afilhados e suas contribuições.'}
          </p>
        </div>

        {hasNoSponsorships ? (
          <div className="mb-6 rounded-lg border-2 border-[var(--ong-orange)] bg-orange-50 p-8 text-center">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-[var(--ong-orange)]"
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
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              Você ainda não apadrinou nenhum animal
            </h3>
            <p className="mb-4 text-gray-600">
              Comece agora a fazer a diferença! Escolha um animal para
              apadrinhar e acompanhe sua jornada.
            </p>
            <Button onClick={() => router.push('/public/animais')}>
              Ver Animais Disponíveis
            </Button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Afilhados
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
                      {dashboardData?.godchildren.total ?? 0}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Animais apadrinhados
                    </p>
                  </>
                )}
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Contribuição Total
                  </h3>
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
                      {(dashboardData?.contributions.total ?? 0).toLocaleString(
                        'pt-BR',
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                      )}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Total doado</p>
                  </>
                )}
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-700">Desde</h3>
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {isLoadingStats ? (
                  <div className="h-10 w-16 animate-pulse rounded bg-gray-200"></div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-[var(--ong-purple)]">
                      {getMonthsText(dashboardData?.monthsAsSponsor ?? 0)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">Como padrinho</p>
                  </>
                )}
              </div>
            </div>

            {/* Donation Stats */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
                Suas Doações
              </h3>
              {isLoadingStats ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
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
                      {(
                        dashboardData?.donations.general.total ?? 0
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Média: R${' '}
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
                      {(
                        dashboardData?.donations.year.total ?? 0
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Média: R${' '}
                      {(
                        dashboardData?.donations.year.average ?? 0
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border-2 border-gray-200 p-4">
                    <p className="mb-1 text-sm text-gray-600">Este Mês</p>
                    <p className="text-2xl font-bold text-[var(--ong-purple)]">
                      R${' '}
                      {(
                        dashboardData?.donations.month.total ?? 0
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Média: R${' '}
                      {(
                        dashboardData?.donations.month.average ?? 0
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg border-2 border-gray-200 p-4">
                    <p className="mb-1 text-sm text-gray-600">Esta Semana</p>
                    <p className="text-2xl font-bold text-[var(--ong-orange)]">
                      R${' '}
                      {(
                        dashboardData?.donations.week.total ?? 0
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Média: R${' '}
                      {(
                        dashboardData?.donations.week.average ?? 0
                      ).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sponsorship History */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
                Histórico de Apadrinhamento
              </h3>
              {isLoadingStats ? (
                <div className="h-20 w-full animate-pulse rounded bg-gray-200"></div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border-2 border-gray-200 p-4">
                    <p className="mb-1 text-sm text-gray-600">
                      Primeiro Apadrinhamento
                    </p>
                    <p className="text-lg font-bold text-[var(--ong-purple)]">
                      {dashboardData?.history.firstSponsorshipDate
                        ? new Date(
                            dashboardData.history.firstSponsorshipDate,
                          ).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="rounded-lg border-2 border-gray-200 p-4">
                    <p className="mb-1 text-sm text-gray-600">
                      Total de Apadrinhamentos
                    </p>
                    <p className="text-lg font-bold text-[var(--ong-orange)]">
                      {dashboardData?.history.totalSponsorshipsEver ?? 0}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Incluindo inativos
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* My Pets - Real data from API */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
                Meus Afilhados
              </h3>
              {isLoadingAnimals ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-64 w-full animate-pulse rounded-lg bg-gray-200"
                    ></div>
                  ))}
                </div>
              ) : sponsoredAnimals.length === 0 ? (
                <p className="text-center text-gray-500">
                  Você ainda não possui animais apadrinhados.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sponsoredAnimals.map((sponsorship) => (
                    <div
                      key={sponsorship.uuid}
                      className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)]"
                    >
                      <div className="relative mb-3 flex justify-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-200">
                          {sponsorship.animal.photo ? (
                            <Image
                              src={getFullImageUrl(sponsorship.animal.photo)}
                              alt={sponsorship.animal.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('data:image')) {
                                  target.onerror = null;
                                  target.src =
                                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.839 48.839" fill="%239333ea"%3E%3Cpath d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414S48.455,16.861,45.727,15.602z"/%3E%3C/svg%3E';
                                }
                              }}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <svg
                                className="h-16 w-16 text-[var(--ong-purple)]"
                                viewBox="0 0 48.839 48.839"
                                fill="currentColor"
                              >
                                <path d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252 c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373 c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742 c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181 C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0 S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971 s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878 c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414 S48.455,16.861,45.727,15.602z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <h4 className="mb-1 text-center text-lg font-bold">
                        {sponsorship.animal.name}
                      </h4>
                      <p className="mb-2 text-center text-sm text-gray-600">
                        {sponsorship.animal.breed}, {sponsorship.animal.age}{' '}
                        {sponsorship.animal.age === 1 ? 'ano' : 'anos'}
                      </p>
                      {sponsorship.animal.tags.length > 0 && (
                        <div className="mb-3 flex flex-wrap items-center justify-center gap-1">
                          {sponsorship.animal.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="rounded-full px-2 py-1 text-xs text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="mb-3 text-center text-xs text-gray-500">
                        Apadrinhado desde{' '}
                        {new Date(
                          sponsorship.sponsoredSince,
                        ).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                      <Button
                        variant="secondary"
                        fullWidth
                        onClick={() =>
                          handleWhatsAppContact(sponsorship.animal.name)
                        }
                      >
                        Pedir Informações
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
                Ações Rápidas
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <CardButton
                  title="Meu perfil"
                  onClick={() => router.push('/sponsor/profile')}
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
                <CardButton
                  title="Fazer Doação Extra"
                  onClick={() => router.push('/sponsor/donate')}
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
                <CardButton
                  title="Minhas Doações"
                  onClick={() => router.push('/sponsor/donations')}
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
                      d="M17 9V7a5 5 0 00-10 0v2M5 9h14l1 12H4L5 9zm4 4h6"
                    />
                  </svg>
                </CardButton>
                <CardButton
                  title="Ver Fotos"
                  onClick={() => router.push('/sponsor/photos')}
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </CardButton>
                <CardButton
                  title="Enviar Mensagem"
                  onClick={() => router.push('/sponsor/message')}
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </CardButton>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
                Atualizações Recentes
              </h3>
              <div className="space-y-4">
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Novas fotos do Rex
                    </p>
                    <p className="text-sm text-gray-600">
                      Rex está se adaptando muito bem ao novo lar temporário!
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Há 1 dia</p>
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Max em tratamento
                    </p>
                    <p className="text-sm text-gray-600">
                      Max está recebendo tratamento veterinário. Tudo está indo
                      bem!
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Há 3 dias</p>
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Obrigado pela contribuição!
                    </p>
                    <p className="text-sm text-gray-600">
                      Sua contribuição mensal foi recebida. Muito obrigado!
                    </p>
                    <p className="mt-1 text-xs text-gray-500">Há 1 semana</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
