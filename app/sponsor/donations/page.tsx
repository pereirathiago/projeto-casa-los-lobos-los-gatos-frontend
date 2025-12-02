'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../assets/icons/logo-ong.svg';
import Button from '../../components/Button';
import type { SponsorDonation } from '../../services/api';
import { apiService } from '../../services/api';
import { authService } from '../../services/auth';

export default function SponsorDonationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [donations, setDonations] = useState<SponsorDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (!authService.isAuthenticated()) {
        toast.error('Acesso negado. Faça login para continuar.');
        router.push('/login');
        return;
      }

      const sponsorUser = await authService.refreshSponsorUser(apiService);

      if (!sponsorUser || sponsorUser.role !== 'sponsor') {
        toast.error('Acesso exclusivo para padrinhos.');
        router.push('/dashboard');
        return;
      }

      setUser(sponsorUser);
      loadDonations();
    }

    init();
  }, [router]);

  const loadDonations = async () => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) return;

      const response = await apiService.getMyDonations(token);
      setDonations(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao carregar doações';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
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

  const totalDonated = useMemo(() => {
    return donations
      .filter((donation) => donation.status === 'confirmed')
      .reduce((sum, donation) => {
        const amount =
          typeof donation.amount === 'number'
            ? donation.amount
            : parseFloat(donation.amount) || 0;
        return sum + amount;
      }, 0);
  }, [donations]);

  const pendingDonations = useMemo(() => {
    return donations.filter((donation) => donation.status === 'pending').length;
  }, [donations]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--ong-purple)]"></div>
          <p className="text-gray-600">Carregando doações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={140}
                height={70}
              />
            </Link>
            <div className="flex items-center gap-4">
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

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center text-sm text-[var(--ong-purple)] transition-colors hover:opacity-80"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar para a Dashboard
        </Link>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--ong-purple)]">
              Minhas Doações
            </h1>
            <p className="mt-2 text-gray-600">
              Acompanhe o histórico das suas contribuições para a ONG
            </p>
          </div>
          <Button onClick={() => router.push('/sponsor/donations/new')}>
            Nova Doação
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">Total Doados</p>
            <p className="mt-2 text-3xl font-bold text-[var(--ong-purple)]">
              {formatCurrency(totalDonated)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Desde o início do seu apoio
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Doações Pendentes
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--ong-orange)]">
              {pendingDonations}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Aguardando confirmação da ONG
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">Última Doação</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {donations[0]
                ? `${formatCurrency(donations[0].amount)} • ${formatDate(
                    donations[0].donationDate,
                  )}`
                : 'Ainda não há doações'}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Conferimos cada contribuição com carinho 💜
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Data da Doação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Observações
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Confirmado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {donations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto mb-4 h-12 w-12 text-gray-400"
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
                        <p className="text-lg font-semibold">
                          Você ainda não realizou nenhuma doação
                        </p>
                        <p className="mt-2 text-sm">
                          Clique em &quot;Nova Doação&quot; para fazer sua
                          primeira contribuição!
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  donations.map((donation) => (
                    <tr key={donation.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-[var(--ong-purple)]">
                        {formatCurrency(donation.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                        {formatDate(donation.donationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            donation.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {donation.status === 'confirmed'
                            ? 'Confirmada'
                            : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {donation.notes || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                        {donation.confirmedAt
                          ? formatDate(donation.confirmedAt)
                          : 'Aguardando'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(`/sponsor/donations/${donation.uuid}`)
                          }
                          className="text-xs"
                        >
                          Ver Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
