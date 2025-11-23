'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '../assets/icons/logo-ong.svg';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import Button from './Button';
import CardButton from './CardButton';

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
            Olá, {user?.name}!
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
              <svg
                className="h-8 w-8 text-[var(--ong-purple)]"
                viewBox="0 0 48.839 48.839"
                fill="currentColor"
              >
                <path d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252 c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373 c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742 c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181 C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0 S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971 s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878 c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414 S48.455,16.861,45.727,15.602z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-purple)]">3</p>
            <p className="mt-1 text-sm text-gray-500">Animais apadrinhados</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">
                Contribuição Mensal
              </h3>
              <svg
                className="h-8 w-8 text-[var(--ong-orange)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-3xl font-bold text-[var(--ong-orange)]">
              R$ 150
            </p>
            <p className="mt-1 text-sm text-gray-500">Valor total por mês</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Desde</h3>
              <svg
                className="h-8 w-8 text-[var(--ong-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
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
              <div className="mb-3 flex justify-center">
                <svg
                  className="h-16 w-16 text-[var(--ong-purple)]"
                  viewBox="0 0 48.839 48.839"
                  fill="currentColor"
                >
                  <path d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252 c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373 c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742 c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181 C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0 S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971 s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878 c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414 S48.455,16.861,45.727,15.602z" />
                </svg>
              </div>
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
              <div className="mb-3 flex justify-center">
                <svg
                  className="h-16 w-16 text-[var(--ong-purple)]"
                  viewBox="0 0 48.839 48.839"
                  fill="currentColor"
                >
                  <path d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252 c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373 c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742 c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181 C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0 S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971 s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878 c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414 S48.455,16.861,45.727,15.602z" />
                </svg>
              </div>
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
              <div className="mb-3 flex justify-center">
                <svg
                  className="h-16 w-16 text-[var(--ong-purple)]"
                  viewBox="0 0 48.839 48.839"
                  fill="currentColor"
                >
                  <path d="M39.041,36.843c2.054,3.234,3.022,4.951,3.022,6.742c0,3.537-2.627,5.252-6.166,5.252 c-1.56,0-2.567-0.002-5.112-1.326c0,0-1.649-1.509-5.508-1.354c-3.895-0.154-5.545,1.373-5.545,1.373 c-2.545,1.323-3.516,1.309-5.074,1.309c-3.539,0-6.168-1.713-6.168-5.252c0-1.791,0.971-3.506,3.024-6.742 c0,0,3.881-6.445,7.244-9.477c2.43-2.188,5.973-2.18,5.973-2.18h1.093v-0.001c0,0,3.698-0.009,5.976,2.181 C35.059,30.51,39.041,36.844,39.041,36.843z M16.631,20.878c3.7,0,6.699-4.674,6.699-10.439S20.331,0,16.631,0 S9.932,4.674,9.932,10.439S12.931,20.878,16.631,20.878z M10.211,30.988c2.727-1.259,3.349-5.723,1.388-9.971 s-5.761-6.672-8.488-5.414s-3.348,5.723-1.388,9.971C3.684,29.822,7.484,32.245,10.211,30.988z M32.206,20.878 c3.7,0,6.7-4.674,6.7-10.439S35.906,0,32.206,0s-6.699,4.674-6.699,10.439C25.507,16.204,28.506,20.878,32.206,20.878z M45.727,15.602c-2.728-1.259-6.527,1.165-8.488,5.414s-1.339,8.713,1.389,9.972c2.728,1.258,6.527-1.166,8.488-5.414 S48.455,16.861,45.727,15.602z" />
                </svg>
              </div>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <CardButton
              title="Meu perfil"
              onClick={() => router.push('/sponsor/profile')}
            >
              <svg
                className="mb-2 h-8 w-8 justify-self-center text-[var(--ong-purple)]"
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
            </CardButton>
            <CardButton
              title="Fazer Doação Extra"
              onClick={() => router.push('/sponsor/donate')}
            >
              <svg
                className="mb-2 h-8 w-8 justify-self-center text-[var(--ong-orange)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </CardButton>
            <CardButton
              title="Ver Fotos"
              onClick={() => router.push('/sponsor/photos')}
            >
              <svg
                className="mb-2 h-8 w-8 justify-self-center text-[var(--ong-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </CardButton>
            <CardButton
              title="Enviar Mensagem"
              onClick={() => router.push('/sponsor/message')}
            >
              <svg
                className="mb-2 h-8 w-8 justify-self-center text-[var(--ong-purple)]"
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
            </CardButton>
          </div>
        </div>

        {/* Recent Updates */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-[var(--ong-purple)]">
            Atualizações Recentes
          </h3>
          <div className="space-y-4">
            <div className="flex items-start border-l-4 border-[var(--ong-orange)] bg-orange-50 p-3">
              <svg
                className="mr-3 h-6 w-6 flex-shrink-0 text-[var(--ong-orange)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
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
              <svg
                className="mr-3 h-6 w-6 flex-shrink-0 text-[var(--ong-purple)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div>
                <p className="font-semibold text-gray-800">Max em tratamento</p>
                <p className="text-sm text-gray-600">
                  Max está recebendo tratamento veterinário. Tudo está indo bem!
                </p>
                <p className="mt-1 text-xs text-gray-500">Há 3 dias</p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-[var(--ong-orange)] bg-orange-50 p-3">
              <svg
                className="mr-3 h-6 w-6 flex-shrink-0 text-[var(--ong-orange)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
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
