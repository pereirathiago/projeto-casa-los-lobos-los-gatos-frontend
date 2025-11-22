'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../assets/icons/logo-ong.svg';
import Button from '../../components/Button';
import { apiService, Sponsor } from '../../services/api';
import { authService } from '../../services/auth';
import Link from 'next/link';

export default function SponsorProfilePage() {
  const router = useRouter();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = authService.getToken();
        if (!token) {
          toast.error('Acesso negado. Faça login para continuar.');
          router.push('/login');
          return;
        }

        const user = authService.getUser();
        if (user?.role !== 'sponsor') {
          toast.error('Acesso negado.');
          router.push('/dashboard');
          return;
        }

        const profile = await apiService.getMySponsorProfile(token);
        setSponsor(profile);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar perfil');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
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

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.',
      )
    ) {
      return;
    }

    try {
      const token = authService.getToken();
      if (!token) return;

      await apiService.deleteMySponsorProfile(token);
      toast.success('Conta deletada com sucesso');
      authService.clearAuth();
      router.push('/');
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      toast.error('Erro ao deletar conta');
    }
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

  if (!sponsor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Perfil não encontrado</p>
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
                <p className="text-sm font-medium text-gray-900">
                  {sponsor.name}
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
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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
          <div>
            <h1 className="text-3xl font-bold text-[var(--ong-purple)] sm:text-4xl">
              Meu Perfil
            </h1>
            <p className="mt-2 text-gray-600">
              Visualize e gerencie suas informações de conta
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          {/* Header com avatar */}
          <div className="bg-gradient-to-r from-[var(--ong-orange)] to-orange-500 px-6 py-8 sm:px-8">
            <div className="flex items-center space-x-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-[var(--ong-orange)] shadow-lg">
                {sponsor.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {sponsor.name}
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                    <svg
                      className="h-4 w-4"
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
                    Padrinho
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do perfil */}
          <div className="px-6 py-6 sm:px-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Nome */}
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  Nome Completo
                </label>
                <p className="flex items-center text-lg text-gray-900">
                  <svg
                    className="mr-2 h-5 w-5 text-gray-400"
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
                  {sponsor.name}
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  E-mail
                </label>
                <p className="flex items-center text-lg text-gray-900">
                  <svg
                    className="mr-2 h-5 w-5 text-gray-400"
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
                  {sponsor.email}
                </p>
              </div>

              {/* Tipo de conta */}
              <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                  Tipo de Conta
                </label>
                <p className="flex items-center text-lg text-gray-900">
                  <svg
                    className="mr-2 h-5 w-5 text-gray-400"
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
                  Padrinho
                </p>
              </div>
            </div>
          </div>

          {/* Footer com ações */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                onClick={() => router.push('/sponsor/profile/edit')}
                className="inline-flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar Perfil
              </Button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-6">
          <h3 className="mb-2 flex items-center text-lg font-semibold text-red-800">
            <svg
              className="mr-2 h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Zona de Perigo
          </h3>
          <p className="mb-4 text-sm text-red-700">
            Uma vez que você deletar sua conta, não há como voltar atrás. Por
            favor, tenha certeza.
          </p>
          <Button
            variant="outline"
            onClick={handleDeleteAccount}
            className="!border-red-500 !text-red-700 hover:!bg-red-100"
          >
            Deletar Minha Conta
          </Button>
        </div>
      </main>
    </div>
  );
}
