'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../assets/icons/logo-ong.svg';
import Button from '../../components/Button';
import type { AdminDonation } from '../../services/api';
import { apiService } from '../../services/api';
import { authService } from '../../services/auth';

export default function DonationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const donationUuid = params?.uuid as string;
  const [adminName, setAdminName] = useState('Administrador');
  const [donation, setDonation] = useState<AdminDonation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

        const response = await apiService.getDonationByUuid(token, uuid);
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

      const adminUser = await authService.refreshAdminUser(apiService);
      if (!adminUser || adminUser.role !== 'admin') {
        toast.error('Acesso exclusivo para administradores.');
        router.push('/dashboard');
        return;
      }

      if (adminUser.name) {
        setAdminName(adminUser.name);
      }

      if (!donationUuid) {
        toast.error('Doação não encontrada.');
        router.push('/donations');
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

  const handleConfirmDonation = async () => {
    if (!donation) return;

    try {
      setIsProcessing(true);
      const token = authService.getToken();
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
        return;
      }

      await apiService.confirmDonation(token, donation.uuid);
      toast.success('Doação confirmada com sucesso!');
      setShowConfirmModal(false);
      loadDonation(donation.uuid);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao confirmar doação';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDonation = async () => {
    if (!donation) return;

    try {
      setIsProcessing(true);
      const token = authService.getToken();
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
        return;
      }

      await apiService.deleteDonation(token, donation.uuid);
      toast.success('Doação removida com sucesso.');
      setShowDeleteModal(false);
      router.push('/donations');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao remover doação';
      toast.error(message);
    } finally {
      setIsProcessing(false);
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
          <Button onClick={() => router.push('/donations')} className="mt-4">
            Voltar para Doações
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
                <p className="text-sm font-medium text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/donations')}
              >
                Ver Doações
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/donations"
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
              Voltar para Doações
            </Link>
            <h1 className="text-3xl font-bold text-[var(--ong-purple)]">
              Detalhes da Doação
            </h1>
            <p className="mt-2 text-gray-600">
              Registro completo da contribuição realizada por{' '}
              {donation.user.name}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => loadDonation(donation.uuid)}
            >
              Recarregar
            </Button>
            {donation.status === 'pending' && (
              <Button onClick={() => setShowConfirmModal(true)}>
                Confirmar Doação
              </Button>
            )}
            <Button
              variant="secondary"
              className="!bg-red-600 hover:!bg-red-500"
              onClick={() => setShowDeleteModal(true)}
            >
              Excluir
            </Button>
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
                  Data informada pelo padrinho
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
                  Confirmado por
                </p>
                <p className="text-lg text-gray-900">
                  {donation.confirmedBy ? donation.confirmedBy.name : '—'}
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
              <p className="text-sm font-medium text-gray-500">
                Padrinho responsável
              </p>
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {donation.user.name}
              </p>
              <p className="text-sm text-gray-500">{donation.user.email}</p>
              <div className="mt-4 rounded-md bg-purple-50 p-3 text-sm text-gray-700">
                <p className="font-semibold text-[var(--ong-purple)]">
                  ID do registro
                </p>
                <p className="text-xs break-all text-gray-600">
                  {donation.uuid}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
              <p className="text-sm font-medium text-gray-500">Ações rápidas</p>
              <div className="mt-4 space-y-3">
                {donation.status === 'pending' && (
                  <Button fullWidth onClick={() => setShowConfirmModal(true)}>
                    Confirmar agora
                  </Button>
                )}
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => router.push('/donations/new')}
                >
                  Registrar outra doação
                </Button>
                <Button
                  variant="tertiary"
                  onClick={() => router.push('/donations')}
                >
                  Voltar para a lista
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Confirmar Doação
            </h3>
            <p className="mb-4 text-gray-700">
              Tem certeza que deseja confirmar a doação de{' '}
              <strong>{formatCurrency(donation.amount)}</strong> do padrinho{' '}
              <strong>{donation.user.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleConfirmDonation} disabled={isProcessing}>
                {isProcessing ? 'Confirmando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-red-600">
              Remover Doação
            </h3>
            <p className="mb-4 text-gray-700">
              Esta ação não pode ser desfeita. Deseja excluir o registro de{' '}
              <strong>{formatCurrency(donation.amount)}</strong> da data{' '}
              <strong>
                {new Date(donation.donationDate).toLocaleDateString('pt-BR')}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="secondary"
                className="!bg-red-600 hover:!bg-red-500"
                onClick={handleDeleteDonation}
                disabled={isProcessing}
              >
                {isProcessing ? 'Removendo...' : 'Excluir'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
