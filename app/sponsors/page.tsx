'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/icons/logo-ong.svg';
import Button from '../components/Button';
import { apiService, Sponsor } from '../services/api';
import { authService } from '../services/auth';

export default function SponsorsListPage() {
  const router = useRouter();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<
    'all' | 'active' | 'inactive'
  >('all');
  const [adminName, setAdminName] = useState('Administrador');

  useEffect(() => {
    async function loadSponsors() {
      try {
        const token = authService.getToken();
        if (!token) {
          toast.error('Acesso negado. Faça login para continuar.');
          router.push('/login');
          return;
        }

        const user = authService.getUser();
        if (user?.role !== 'admin') {
          toast.error('Acesso negado. Apenas administradores podem acessar.');
          router.push('/dashboard');
          return;
        }

        // Definir nome do admin
        if (user?.name) {
          setAdminName(user.name);
        }

        const data = await apiService.getAllSponsors(token);
        setSponsors(data);
      } catch (error) {
        console.error('Erro ao carregar padrinhos:', error);
        toast.error('Erro ao carregar padrinhos');
      } finally {
        setIsLoading(false);
      }
    }

    loadSponsors();
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

  const filteredSponsors = sponsors
    .filter((sponsor) => {
      // Filtro de busca
      const matchesSearch =
        sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sponsor.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro de status
      const matchesFilter =
        filterActive === 'all' ||
        (filterActive === 'active' && sponsor.active && !sponsor.deleted) ||
        (filterActive === 'inactive' && (!sponsor.active || sponsor.deleted));

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Image
              src={logo}
              alt="Logo Casa Los Lobos e Los Gatos"
              width={140}
              height={70}
              onClick={() => router.push('/dashboard')}
              className="cursor-pointer"
            />
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminName}</p>
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
        {/* Page Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="hover:pointer mb-4 inline-flex items-center text-sm text-[var(--ong-purple)] transition-colors hover:opacity-80"
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
          <div>
            <h1 className="text-3xl font-bold text-[var(--ong-purple)] sm:text-4xl">
              Gerenciar Padrinhos
            </h1>
            <p className="mt-2 text-gray-600">
              Gerencie os usuários padrinhos do sistema
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <svg
                  className="mr-1 inline h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Buscar Padrinhos
              </label>
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus:ring-opacity-50 w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <svg
                  className="mr-1 inline h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filtrar por Status
              </label>
              <select
                value={filterActive}
                onChange={(e) =>
                  setFilterActive(
                    e.target.value as 'all' | 'active' | 'inactive',
                  )
                }
                className="focus:ring-opacity-50 w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
              >
                <option value="all">Todos os Status</option>
                <option value="active">✓ Ativos</option>
                <option value="inactive">✗ Inativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sponsors Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    E-mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredSponsors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
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
                        <p className="mt-4 text-sm">
                          Nenhum padrinho encontrado
                        </p>
                        {(searchTerm || filterActive !== 'all') && (
                          <p className="mt-2 text-xs text-gray-400">
                            Tente ajustar os filtros de busca
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSponsors.map((sponsor) => (
                    <tr key={sponsor.uuid} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ong-orange)] to-orange-500 text-sm font-bold text-white shadow-sm">
                            {sponsor.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-medium text-gray-900">
                            {sponsor.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {sponsor.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sponsor.deleted ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs leading-5 font-semibold text-red-800">
                            Deletado
                          </span>
                        ) : sponsor.active ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs leading-5 font-semibold text-green-800">
                            Ativo
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs leading-5 font-semibold text-gray-800">
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <Button
                          onClick={() =>
                            router.push(
                              `/sponsorships/create?email=${encodeURIComponent(sponsor.email)}`,
                            )
                          }
                          variant="outline"
                          className="!px-3 !py-1.5 text-sm"
                          disabled={sponsor.deleted || !sponsor.active}
                        >
                          <svg
                            className="mr-1.5 inline h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Apadrinhar
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
