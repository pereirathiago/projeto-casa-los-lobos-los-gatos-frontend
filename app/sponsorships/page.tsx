'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/icons/logo-ong.svg';
import Button from '../components/Button';
import { apiService, type Sponsorship } from '../services/api';
import { authService } from '../services/auth';

export default function SponsorshipsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (!authService.isAuthenticated()) {
        toast.error('Acesso negado. Por favor, faça login para continuar.');
        router.push('/login');
        return;
      }

      const userData = await authService.refreshAdminUser(apiService);

      if (userData?.role !== 'admin') {
        toast.error('Acesso restrito a administradores.');
        router.push('/dashboard');
        return;
      }

      setUser(userData);
      loadSponsorships();
    }

    init();
  }, [router]);

  const loadSponsorships = async () => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) return;

      const data = await apiService.getSponsorships(token);
      setSponsorships(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao carregar apadrinhamentos',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      const token = authService.getToken();
      if (!token) return;

      await apiService.deleteSponsorship(token, uuid);
      toast.success('Apadrinhamento deletado com sucesso!');
      setDeleteConfirm(null);
      loadSponsorships();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao deletar apadrinhamento',
      );
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleLogout = async () => {
    authService.clearAuth();
    router.push('/login');
  };

  const calculateTotalMonthly = () => {
    return sponsorships
      .filter((s) => s.active)
      .reduce((sum, s) => {
        const amount =
          typeof s.monthlyAmount === 'number'
            ? s.monthlyAmount
            : parseFloat(s.monthlyAmount) || 0;
        return sum + amount;
      }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-[var(--ong-purple)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
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
            <h1 className="text-3xl font-bold text-[var(--ong-purple)]">
              Gerenciar Apadrinhamentos
            </h1>
            <p className="mt-2 text-gray-600">
              Gerencie os apadrinhamentos entre padrinhos e animais
            </p>
          </div>
          <Button
            onClick={() =>
              router.push('/sponsorships/create?source=sponsorships')
            }
          >
            Novo Apadrinhamento
          </Button>
        </div>

        {/* Stats Card */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Total de Apadrinhamentos
            </h3>
            <p className="mt-2 text-3xl font-bold text-[var(--ong-purple)]">
              {sponsorships.length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Apadrinhamentos Ativos
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {sponsorships.filter((s) => s.active).length}
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">
              Doações Mensais Totais
            </h3>
            <p className="mt-2 text-3xl font-bold text-[var(--ong-orange)]">
              {formatCurrency(calculateTotalMonthly())}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Padrinho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Animal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Valor Mensal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {sponsorships.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Nenhum apadrinhamento cadastrado
                    </td>
                  </tr>
                ) : (
                  sponsorships.map((sponsorship) => (
                    <tr key={sponsorship.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sponsorship.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sponsorship.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sponsorship.animal.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sponsorship.animal.breed} •{' '}
                          {sponsorship.animal.type === 'dog' ? 'Cão' : 'Gato'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-[var(--ong-orange)]">
                          {formatCurrency(sponsorship.monthlyAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                            sponsorship.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sponsorship.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {formatDate(sponsorship.date)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <Button
                          onClick={() =>
                            router.push(
                              `/sponsorships/edit/${sponsorship.uuid}`,
                            )
                          }
                          variant="outline"
                          className="mr-3 !px-3 !py-1.5 text-sm"
                        >
                          Editar
                        </Button>
                        <Button
                          onClick={() => setDeleteConfirm(sponsorship.uuid)}
                          variant="outline"
                          className="!border-red-600 !px-3 !py-1.5 text-sm !text-red-600 hover:!bg-red-50 disabled:!cursor-not-allowed disabled:!opacity-50 disabled:hover:!bg-white"
                        >
                          Deletar
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Confirmar Exclusão
            </h3>
            <p className="mb-6 text-gray-600">
              Tem certeza que deseja excluir este apadrinhamento? Esta ação não
              pode ser desfeita.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </Button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
