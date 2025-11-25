'use client';

import { Check, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/icons/logo-ong.svg';
import Button from '../components/Button';
import type { AdminDonation } from '../services/api';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

export default function DonationsAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donationToConfirm, setDonationToConfirm] =
    useState<AdminDonation | null>(null);
  const [donationToDelete, setDonationToDelete] =
    useState<AdminDonation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

      setUser(adminUser);
      loadDonations();
    }

    init();
  }, [router]);

  const loadDonations = async () => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) return;

      const response = await apiService.getDonations(token);
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

  const stats = useMemo(() => {
    const total = donations.length;
    const confirmed = donations.filter(
      (item) => item.status === 'confirmed',
    ).length;
    const pending = total - confirmed;
    const totalAmount = donations
      .filter((donation) => donation.status === 'confirmed')
      .reduce((sum, donation) => {
        const amount =
          typeof donation.amount === 'number'
            ? donation.amount
            : parseFloat(donation.amount) || 0;
        return sum + amount;
      }, 0);
    return { total, confirmed, pending, totalAmount };
  }, [donations]);

  const handleConfirmDonation = async () => {
    if (!donationToConfirm) return;

    try {
      setIsProcessing(true);
      const token = authService.getToken();
      if (!token) return;

      await apiService.confirmDonation(token, donationToConfirm.uuid);
      toast.success('Doação confirmada com sucesso!');
      setDonationToConfirm(null);
      loadDonations();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao confirmar doação';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteDonation = async () => {
    if (!donationToDelete) return;

    try {
      setIsProcessing(true);
      const token = authService.getToken();
      if (!token) return;

      await apiService.deleteDonation(token, donationToDelete.uuid);
      toast.success('Doação removida com sucesso!');
      setDonationToDelete(null);
      loadDonations();
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
          <p className="text-gray-600">Carregando doações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={140}
                height={70}
              />
            </Link>
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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
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
              Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-[var(--ong-purple)]">
              Gerenciar Doações
            </h1>
            <p className="mt-2 text-gray-600">
              Controle completo das doações registradas pela ONG e padrinhos
            </p>
          </div>
          <Button onClick={() => router.push('/donations/new')}>
            <span className="flex items-center gap-2 text-base">
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Nova Doação</span>
            </span>
          </Button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">
              Total de Doações
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--ong-purple)]">
              {stats.total}
            </p>
            <p className="mt-1 text-sm text-gray-500">Registros históricos</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">Confirmadas</p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {stats.confirmed}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Comprovadas pela equipe
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">Pendentes</p>
            <p className="mt-2 text-3xl font-bold text-[var(--ong-orange)]">
              {stats.pending}
            </p>
            <p className="mt-1 text-sm text-gray-500">Aguardando confirmação</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-500">Valor Total</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatCurrency(stats.totalAmount)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Somatório das doações confirmadas
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Doador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Valor / Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Confirmado por
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Observações
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {donations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Nenhuma doação registrada até o momento.
                    </td>
                  </tr>
                ) : (
                  donations.map((donation) => (
                    <tr key={donation.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <p className="font-semibold text-gray-900">
                          {donation.user.name}
                        </p>
                        <p className="text-gray-500">{donation.user.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-semibold text-[var(--ong-purple)]">
                          {formatCurrency(donation.amount)}
                        </p>
                        <p className="text-gray-500">
                          {formatDateTime(donation.donationDate)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
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
                        {donation.confirmedBy ? donation.confirmedBy.name : '—'}
                        <br />
                        <span className="text-xs">
                          {donation.confirmedAt
                            ? formatDateTime(donation.confirmedAt)
                            : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {donation.notes || '—'}
                      </td>
                      <td className="px-6 py-4 text-right text-sm">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            className="!px-3 !py-1.5 text-xs"
                            onClick={() =>
                              router.push(`/donations/${donation.uuid}`)
                            }
                          >
                            Detalhes
                          </Button>
                          {donation.status === 'pending' && (
                            <button
                              onClick={() => setDonationToConfirm(donation)}
                              title="Confirmar doação"
                              className="inline-flex items-center justify-center rounded-lg border border-green-600 p-2 text-green-600 transition-colors hover:cursor-pointer hover:bg-green-50"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setDonationToDelete(donation)}
                            title="Excluir doação"
                            className="inline-flex items-center justify-center rounded-lg border border-red-600 p-2 text-red-600 transition-colors hover:cursor-pointer hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {donationToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Confirmar Doação
            </h3>
            <p className="mb-4 text-gray-700">
              Tem certeza que deseja confirmar a doação de{' '}
              <strong>{formatCurrency(donationToConfirm.amount)}</strong> do
              padrinho <strong>{donationToConfirm.user.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDonationToConfirm(null)}
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

      {donationToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-black">
              Confirmar Exclusão
            </h3>
            <p className="mb-4 text-gray-700">
              Esta ação irá remover a doação de{' '}
              <strong>{formatCurrency(donationToDelete.amount)}</strong> do
              padrinho <strong>{donationToDelete.user.name}</strong>. Deseja
              continuar?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setDonationToDelete(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="secondary"
                onClick={handleDeleteDonation}
                disabled={isProcessing}
              >
                {isProcessing ? 'Removendo...' : 'Confirmar Exclusão'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
