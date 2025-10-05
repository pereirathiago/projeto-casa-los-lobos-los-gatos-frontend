'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from './Button';
import logo from '../assets/icons/logo-ong.svg';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

interface PadrinhoDashboardProps {
  user: any;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2 text-[var(--ong-purple)]">
            Olá, {user?.name}! 💜
          </h2>
          <p className="text-gray-600">
            Obrigado por ser um padrinho/madrinha! Acompanhe aqui seus afilhados e suas contribuições.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Afilhados</h3>
              <span className="text-3xl">🐕</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">3</p>
            <p className="text-sm text-gray-500 mt-1">Animais apadrinhados</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Contribuição Mensal</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-orange)]">R$ 150</p>
            <p className="text-sm text-gray-500 mt-1">Valor total por mês</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Desde</h3>
              <span className="text-3xl">📅</span>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">6 meses</p>
            <p className="text-sm text-gray-500 mt-1">Como padrinho</p>
          </div>
        </div>

        {/* My Pets */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-[var(--ong-purple)]">
            Meus Afilhados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-[var(--ong-purple)] transition-all">
              <div className="text-5xl mb-3 text-center">🐕</div>
              <h4 className="font-bold text-lg text-center mb-2">Rex</h4>
              <p className="text-sm text-gray-600 text-center mb-2">Labrador, 3 anos</p>
              <div className="flex items-center justify-center">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Saudável
                </span>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-[var(--ong-purple)] transition-all">
              <div className="text-5xl mb-3 text-center">🐱</div>
              <h4 className="font-bold text-lg text-center mb-2">Luna</h4>
              <p className="text-sm text-gray-600 text-center mb-2">Gata, 2 anos</p>
              <div className="flex items-center justify-center">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Saudável
                </span>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-[var(--ong-purple)] transition-all">
              <div className="text-5xl mb-3 text-center">🐕</div>
              <h4 className="font-bold text-lg text-center mb-2">Max</h4>
              <p className="text-sm text-gray-600 text-center mb-2">Vira-lata, 4 anos</p>
              <div className="flex items-center justify-center">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Tratamento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-[var(--ong-purple)]">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)] transition-all">
              <div className="text-3xl mb-2">💰</div>
              <p className="font-semibold text-gray-700">Fazer Doação Extra</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)] transition-all">
              <div className="text-3xl mb-2">📸</div>
              <p className="font-semibold text-gray-700">Ver Fotos</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-[var(--ong-purple)] hover:bg-[var(--ong-purple-50)] transition-all">
              <div className="text-3xl mb-2">📧</div>
              <p className="font-semibold text-gray-700">Enviar Mensagem</p>
            </button>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-[var(--ong-purple)]">
            Atualizações Recentes
          </h3>
          <div className="space-y-4">
            <div className="flex items-start p-3 border-l-4 border-[var(--ong-orange)] bg-orange-50">
              <span className="text-2xl mr-3">📸</span>
              <div>
                <p className="font-semibold text-gray-800">Novas fotos do Rex</p>
                <p className="text-sm text-gray-600">Rex está se adaptando muito bem ao novo lar temporário!</p>
                <p className="text-xs text-gray-500 mt-1">Há 1 dia</p>
              </div>
            </div>
            <div className="flex items-start p-3 border-l-4 border-[var(--ong-purple)] bg-purple-50">
              <span className="text-2xl mr-3">💉</span>
              <div>
                <p className="font-semibold text-gray-800">Max em tratamento</p>
                <p className="text-sm text-gray-600">Max está recebendo tratamento veterinário. Tudo está indo bem!</p>
                <p className="text-xs text-gray-500 mt-1">Há 3 dias</p>
              </div>
            </div>
            <div className="flex items-start p-3 border-l-4 border-[var(--ong-orange)] bg-orange-50">
              <span className="text-2xl mr-3">💜</span>
              <div>
                <p className="font-semibold text-gray-800">Obrigado pela contribuição!</p>
                <p className="text-sm text-gray-600">Sua contribuição mensal foi recebida. Muito obrigado!</p>
                <p className="text-xs text-gray-500 mt-1">Há 1 semana</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
