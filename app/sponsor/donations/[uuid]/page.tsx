'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../../assets/icons/logo-ong.svg';
import Button from '../../../components/Button';
import type { SponsorDonation } from '../../../services/api';
import { apiService } from '../../../services/api';
import { authService } from '../../../services/auth';

export default function SponsorDonationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const donationUuid = params?.uuid as string;
  const [userName, setUserName] = useState('');
  const [donation, setDonation] = useState<SponsorDonation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDonation = useCallback(
    async (uuid: string) => {
      try {
        setIsLoading(true);
        const token = authService.getToken();
        if (!token) {
          toast.error('Sessão expirada. Faça login novamente.');
          router.push('/login');
          return;
        }

        const response = await apiService.getMyDonationByUuid(token, uuid);
        setDonation(response);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Erro ao carregar a doação';
        toast.error(message);
        setDonation(null);
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

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

      if (sponsorUser.name) {
        setUserName(sponsorUser.name);
      }

      if (!donationUuid) {
        toast.error('Doação não encontrada.');
        router.push('/sponsor/donations');
        return;
      }

      loadDonation(donationUuid);
    }

    init();
  }, [router, donationUuid, loadDonation]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDateTime = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--ong-purple)]"></div>
          <p className="text-gray-600">Carregando doação...</p>
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Doação não encontrada.</p>
          <Button
            onClick={() => router.push('/sponsor/donations')}
            className="mt-4"
          >
            Voltar para Minhas Doações
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
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
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">Padrinho</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/sponsor/donations"
              className="mb-2 inline-flex items-center text-sm text-[var(--ong-purple)] transition-colors hover:opacity-80"
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
              Voltar para Minhas Doações
            </Link>
            <h1 className="text-3xl font-bold text-[var(--ong-purple)]">
              Detalhes da Doação
            </h1>
            <p className="mt-2 text-gray-600">
              Registro completo da sua contribuição
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Valor da doação</p>
                <p className="text-3xl font-bold text-[var(--ong-purple)]">
                  {formatCurrency(donation.amount)}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                  donation.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {donation.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Data informada
                </p>
                <p className="text-lg text-gray-900">
                  {formatDateTime(donation.donationDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Registro criado em
                </p>
                <p className="text-lg text-gray-900">
                  {formatDateTime(donation.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Confirmado em
                </p>
                <p className="text-lg text-gray-900">
                  {formatDateTime(donation.confirmedAt)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500">Observações</p>
              <p className="mt-2 rounded-md bg-gray-50 p-4 text-gray-700">
                {donation.notes || 'Nenhuma observação foi adicionada.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-4">
                {donation.status === 'confirmed' ? (
                  <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">
                    <svg
                      className="h-8 w-8 text-green-600"
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
                      <p className="font-semibold text-green-800">
                        Doação Confirmada
                      </p>
                      <p className="text-sm text-green-600">
                        A ONG confirmou o recebimento.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-lg bg-yellow-50 p-4">
                    <svg
                      className="h-8 w-8 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="font-semibold text-yellow-800">
                        Aguardando Confirmação
                      </p>
                      <p className="text-sm text-yellow-600">
                        A ONG irá verificar em breve.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <p className="text-sm font-medium text-gray-500">Ações</p>
              <div className="mt-4 space-y-3">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => router.push('/sponsor/donations/new')}
                >
                  Registrar outra doação
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
