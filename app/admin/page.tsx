'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/icons/logo-ong.svg';
import Button from '../components/Button';
import { Admin, apiService } from '../services/api';
import { authService } from '../services/auth';

export default function AdminsListPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  useEffect(() => {
    // Verificar autenticação
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Carregar dados do usuário
    const userData = authService.getUser();

    // Verificar se é master admin
    if (!authService.isMasterAdmin()) {
      router.push('/dashboard');
      return;
    }

    setUser(userData);
    loadAdmins();
  }, [router]);

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) throw new Error('Token não encontrado');

      const adminsList = await apiService.getAdmins(token);
      setAdmins(adminsList);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar administradores';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (admin: Admin) => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token não encontrado');

      await apiService.deleteAdmin(token, admin.id.toString());
      toast.success('Administrador deletado com sucesso!');
      setAdminToDelete(null);
      loadAdmins();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao deletar administrador';
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    authService.clearAuth();
    router.push('/login');
  };

  if (isLoading && admins.length === 0) {
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
        {/* Page Header */}
        <div className="mb-6">
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
            Voltar ao Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[var(--ong-purple)] sm:text-4xl">
                Gerenciar Administradores
              </h1>
              <p className="mt-2 text-gray-600">
                Gerencie os usuários administradores do sistema
              </p>
            </div>
            <Button onClick={() => router.push('/admin/new')}>
              + Novo Administrador
            </Button>
          </div>
        </div>

        {/* Admins Table */}
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
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg font-semibold">
                          Nenhum administrador encontrado
                        </p>
                        <p className="mt-2 text-sm">
                          Clique em &quot;Novo Administrador&quot; para
                          adicionar um
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">
                            {admin.name}
                          </div>
                          {admin.is_master && (
                            <span className="inline-flex rounded-full bg-[var(--ong-purple)] px-2 py-0.5 text-xs font-semibold text-white">
                              Master
                            </span>
                          )}
                          {admin.id.toString() === user?.id && (
                            <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                              Você
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {admin.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold ${
                            admin.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {admin.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {new Date(admin.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/admin/${admin.id}`)}
                          className="mr-3 !px-3 !py-1.5 text-sm"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setAdminToDelete(admin)}
                          disabled={admin.is_master}
                          className="!border-red-600 !px-3 !py-1.5 text-sm !text-red-600 hover:!bg-red-50 disabled:!cursor-not-allowed disabled:!opacity-50 disabled:hover:!bg-white"
                          title={
                            admin.is_master
                              ? 'Master admin não pode ser deletado'
                              : 'Deletar administrador'
                          }
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

      {/* Modal de Confirmação de Exclusão */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            {adminToDelete.is_master ? (
              <>
                <h3 className="mb-4 text-lg font-bold text-red-600">
                  Ação Não Permitida
                </h3>
                <p className="mb-6 text-gray-600">
                  Master admin <strong>{adminToDelete.name}</strong> não pode
                  ser deletado. Esta é uma conta protegida do sistema.
                </p>
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setAdminToDelete(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-4 text-lg font-bold text-gray-900">
                  Confirmar Exclusão
                </h3>
                <p className="mb-6 text-gray-600">
                  Tem certeza que deseja deletar o administrador{' '}
                  <strong>{adminToDelete.name}</strong>? Esta ação não pode ser
                  desfeita.
                </p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setAdminToDelete(null)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(adminToDelete)}
                  >
                    Confirmar Exclusão
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
