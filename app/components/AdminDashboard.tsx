'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '../assets/icons/logo-ong.svg';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import Button from './Button';

interface AdminDashboardProps {
  user: { id: string; name: string; email: string; role: string };
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={140}
                height={70}
              />
            </div>
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
        {/* Welcome Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-2xl font-bold text-[var(--ong-purple)]">
            Bem-vindo, {user?.name}! 👋
          </h2>
          <p className="text-gray-600">
            Painel de Administração - Gerencie os animais, padrinhos e doações
            da ONG.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Animais Totais
              </h3>
              <span className="text-3xl">🐕</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">45</p>
            <p className="mt-1 text-sm text-gray-500">Sob cuidado da ONG</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Padrinhos</h3>
              <span className="text-3xl">💜</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-orange)]">28</p>
            <p className="mt-1 text-sm text-gray-500">
              Contribuindo ativamente
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Adoções</h3>
              <span className="text-3xl">🎉</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">12</p>
            <p className="mt-1 text-sm text-gray-500">Este mês</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Doações</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-orange)]">
              R$ 12.5k
            </p>
            <p className="mt-1 text-sm text-gray-500">Arrecadado este mês</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => router.push('/animals/new')}
              className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)]"
            >
              <div className="mb-2 text-3xl">🐕</div>
              <p className="font-semibold text-gray-700">Cadastrar Animal</p>
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)]"
            >
              <div className="mb-2 text-3xl">👥</div>
              <p className="font-semibold text-gray-700">Gerenciar Admins</p>
            </button>
            <button className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)]">
              <div className="mb-2 text-3xl">�</div>
              <p className="font-semibold text-gray-700">Gerenciar Padrinhos</p>
            </button>
            <button className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)]">
              <div className="mb-2 text-3xl">📊</div>
              <p className="font-semibold text-gray-700">Relatórios</p>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Atividades Recentes
          </h3>
          <div className="space-y-4">
            <div className="flex items-start border-l-4 border-[var(--ong-purple)] bg-purple-50 p-3">
              <span className="mr-3 text-2xl">🐕</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Novo animal resgatado
                </p>
                <p className="text-sm text-gray-600">
                  Max, um labrador de 2 anos, foi resgatado hoje.
                </p>
                <p className="mt-1 text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-[var(--ong-orange)] bg-orange-50 p-3">
              <span className="mr-3 text-2xl">💜</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Novo padrinho cadastrado
                </p>
                <p className="text-sm text-gray-600">
                  Maria Silva se tornou madrinha do Rex.
                </p>
                <p className="mt-1 text-xs text-gray-500">Há 5 horas</p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-[var(--ong-purple)] bg-purple-50 p-3">
              <span className="mr-3 text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-gray-800">Animal adotado</p>
                <p className="text-sm text-gray-600">
                  Bella foi adotada pela família Santos.
                </p>
                <p className="mt-1 text-xs text-gray-500">Ontem</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
