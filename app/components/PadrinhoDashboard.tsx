'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from './Button';
import logo from '../assets/icons/logo-ong.svg';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

interface PadrinhoDashboardProps {
  user: { id: string; name: string; email: string; role: string } | null;
}

export default function PadrinhoDashboard({ user }: PadrinhoDashboardProps) {
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-2 text-2xl font-bold text-[var(--ong-purple)]">
            Olá, {user?.name}! 💜
          </h2>
          <p className="text-gray-600">
            Obrigado por ser um padrinho/madrinha! Acompanhe aqui seus afilhados
            e suas contribuições.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Afilhados</h3>
              <span className="text-3xl">🐕</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">3</p>
            <p className="mt-1 text-sm text-gray-500">Animais apadrinhados</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Contribuição Mensal
              </h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-orange)]">
              R$ 150
            </p>
            <p className="mt-1 text-sm text-gray-500">Valor total por mês</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Desde</h3>
              <span className="text-3xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">
              6 meses
            </p>
            <p className="mt-1 text-sm text-gray-500">Como padrinho</p>
          </div>
        </div>

        {/* My Pets */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Meus Afilhados
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)]">
              <div className="mb-3 text-center text-5xl">🐕</div>
              <h4 className="mb-2 text-center text-lg font-bold">Rex</h4>
              <p className="mb-2 text-center text-sm text-gray-600">
                Labrador, 3 anos
              </p>
              <div className="flex items-center justify-center">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
                  Saudável
                </span>
              </div>
            </div>

            <div className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)]">
              <div className="mb-3 text-center text-5xl">🐱</div>
              <h4 className="mb-2 text-center text-lg font-bold">Luna</h4>
              <p className="mb-2 text-center text-sm text-gray-600">
                Gata, 2 anos
              </p>
              <div className="flex items-center justify-center">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
                  Saudável
                </span>
              </div>
            </div>

            <div className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)]">
              <div className="mb-3 text-center text-5xl">🐕</div>
              <h4 className="mb-2 text-center text-lg font-bold">Max</h4>
              <p className="mb-2 text-center text-sm text-gray-600">
                Vira-lata, 4 anos
              </p>
              <div className="flex items-center justify-center">
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-800">
                  Tratamento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <button className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)]">
              <div className="mb-2 text-3xl">💰</div>
              <p className="font-semibold text-gray-700">Fazer Doação Extra</p>
            </button>
            <button className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)]">
              <div className="mb-2 text-3xl">📸</div>
              <p className="font-semibold text-gray-700">Ver Fotos</p>
            </button>
            <button className="rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)]">
              <div className="mb-2 text-3xl">📧</div>
              <p className="font-semibold text-gray-700">Enviar Mensagem</p>
            </button>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Atualizações Recentes
          </h3>
          <div className="space-y-4">
            <div className="flex items-start border-l-4 border-[var(--ong-orange)] bg-orange-50 p-3">
              <span className="mr-3 text-2xl">📸</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Novas fotos do Rex
                </p>
                <p className="text-sm text-gray-600">
                  Rex está se adaptando muito bem ao novo lar temporário!
                </p>
                <p className="mt-1 text-xs text-gray-500">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-[var(--ong-purple)] bg-purple-50 p-3">
              <span className="mr-3 text-2xl">💉</span>
              <div>
                <p className="font-semibold text-gray-800">Max em tratamento</p>
                <p className="text-sm text-gray-600">
                  Max está recebendo tratamento veterinário. Tudo está indo bem!
                </p>
                <p className="mt-1 text-xs text-gray-500">Há 3 dias</p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-[var(--ong-orange)] bg-orange-50 p-3">
              <span className="mr-3 text-2xl">💜</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Obrigado pela contribuição!
                </p>
                <p className="text-sm text-gray-600">
                  Sua contribuição mensal foi recebida. Muito obrigado!
                </p>
                <p className="mt-1 text-xs text-gray-500">Há 1 semana</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
