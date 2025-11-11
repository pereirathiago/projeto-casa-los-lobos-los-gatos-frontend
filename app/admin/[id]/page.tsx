'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '../../assets/icons/logo-ong.svg';
import AdminForm from '../../components/AdminForm';
import Alert from '../../components/Alert';
import Button from '../../components/Button';
import { Admin, apiService, UpdateAdminData } from '../../services/api';
import { authService } from '../../services/auth';

export default function EditAdminPage() {
  const router = useRouter();
  const params = useParams();
  const adminId = params?.id ? parseInt(params.id as string) : null;

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    // Verificar autenticação
    if (!authService.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Carregar dados do usuário
    const userData = authService.getUser();

    // Verificar se é admin
    if (userData?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUser(userData);

    // Carregar dados do admin
    if (adminId) {
      loadAdmin(adminId);
    } else {
      router.push('/admin');
    }
  }, [router, adminId]);

  const loadAdmin = async (id: number) => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) throw new Error('Token não encontrado');

      const adminData = await apiService.getAdminById(token, id.toString());
      setAdmin(adminData);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao carregar administrador';
      setAlert({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateAdminData) => {
    if (!adminId) return;

    try {
      setIsSaving(true);
      const token = authService.getToken();
      if (!token) throw new Error('Token não encontrado');

      await apiService.updateAdmin(token, adminId.toString(), data);
      setAlert({
        type: 'success',
        message: 'Administrador atualizado com sucesso!',
      });

      // Recarregar dados do admin
      await loadAdmin(adminId);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao atualizar administrador';
      setAlert({
        type: 'error',
        message: errorMessage,
      });
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

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Administrador não encontrado</p>
          <Button onClick={() => router.push('/admin')} className="mt-4">
            Voltar para lista
          </Button>
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
            Editar Administrador
          </h1>
          <p className="mt-2 text-gray-600">
            Atualize os dados do administrador {admin.name}
          </p>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Form Card */}
        <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
          <AdminForm
            admin={admin}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/admin')}
            isLoading={isSaving}
          />
        </div>
      </main>
    </div>
  );
}
