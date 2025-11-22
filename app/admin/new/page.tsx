'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../assets/icons/logo-ong.svg';
import AdminForm from '../../components/AdminForm';
import Button from '../../components/Button';
import {
  apiService,
  CreateAdminData,
  UpdateAdminData,
} from '../../services/api';
import { authService } from '../../services/auth';

export default function NewAdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function init() {
      // Verificar autenticação
      if (!authService.isAuthenticated()) {
        toast.error('Acesso negado. Por favor, faça login para continuar.');
        router.push('/login');
        return;
      }

      // Verificar se é master admin
      if (!authService.isMasterAdmin()) {
        router.push('/dashboard');
        return;
      }

      // Buscar dados atualizados do usuário
      const userData = await authService.refreshAdminUser(apiService);
      setUser(userData);
      setIsLoading(false);
    }

    init();
  }, [router]);

  const handleSubmit = async (data: CreateAdminData | UpdateAdminData) => {
    try {
      setIsSaving(true);
      const token = authService.getToken();
      if (!token) throw new Error('Token não encontrado');

      await apiService.createAdmin(token, data as CreateAdminData);
      toast.success('Administrador criado com sucesso!');
      router.push('/admin');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao criar administrador';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    authService.clearAuth();
    router.push('/login');
  };

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
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <Link
            href="/admin"
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
            Voltar para Administradores
          </Link>
          <h1 className="text-3xl font-bold text-[var(--ong-purple)] sm:text-4xl">
            Criar Novo Administrador
          </h1>
          <p className="mt-2 text-gray-600">
            Preencha os dados para criar um novo administrador do sistema
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
          <AdminForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin')}
            isLoading={isSaving}
          />
        </div>
      </main>
    </div>
  );
}
