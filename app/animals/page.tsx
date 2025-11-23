'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/icons/logo-ong.svg';
import Button from '../components/Button';
import { Animal, AnimalFilters, apiService } from '../services/api';
import { authService } from '../services/auth';
import { getFullImageUrl } from '../utils/imageUrl';

export default function AnimalsListPage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [filters, setFilters] = useState<AnimalFilters>({});
  const [tempFilters, setTempFilters] = useState<AnimalFilters>({});

  useEffect(() => {
    async function init() {
      // Verificar autenticação
      if (!authService.isAuthenticated()) {
        toast.error('Acesso negado. Por favor, faça login para continuar.');
        router.push('/login');
        return;
      }

      // Buscar dados atualizados do usuário
      const userData = await authService.refreshAdminUser(apiService);

      // Verificar se é admin
      if (userData?.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(userData);
      loadAnimals();
    }

    init();
  }, [router]);

  const loadAnimals = async (appliedFilters: AnimalFilters = {}) => {
    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) {
        throw new Error('É necessário estar autenticado');
      }
      const animalsList = await apiService.getAnimals(token, appliedFilters);
      setAnimals(animalsList);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar animais';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (animal: Animal) => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token não encontrado');

      await apiService.deleteAnimal(token, animal.uuid);
      toast.success('Animal deletado com sucesso!');
      setAnimalToDelete(null);
      loadAnimals();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao deletar animal';
      toast.error(errorMessage);
    }
  };

  const handleLogout = async () => {
    authService.clearAuth();
    router.push('/login');
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    loadAnimals(tempFilters);
  };

  const handleClearFilters = () => {
    setTempFilters({});
    setFilters({});
    loadAnimals({});
  };

  const getTypeLabel = (type: 'dog' | 'cat') => {
    return type === 'dog' ? 'Cão' : 'Gato';
  };

  if (isLoading && animals.length === 0) {
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
                Gerenciar Animais
              </h1>
              <p className="mt-2 text-gray-600">
                Gerencie os animais disponíveis para apadrinhamento
              </p>
            </div>
            <Button onClick={() => router.push('/animals/new')}>
              + Novo Animal
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Filtros</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                value={tempFilters.type || ''}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    type: e.target.value as 'dog' | 'cat' | undefined,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--ong-purple)] focus:ring-1 focus:ring-[var(--ong-purple)] focus:outline-none"
              >
                <option value="">Todos</option>
                <option value="dog">Cães</option>
                <option value="cat">Gatos</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Raça
              </label>
              <input
                type="text"
                value={tempFilters.breed || ''}
                onChange={(e) =>
                  setTempFilters({ ...tempFilters, breed: e.target.value })
                }
                placeholder="Filtrar por raça"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--ong-purple)] focus:ring-1 focus:ring-[var(--ong-purple)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Idade Mínima
              </label>
              <input
                type="number"
                value={tempFilters.minAge || ''}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    minAge: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0"
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--ong-purple)] focus:ring-1 focus:ring-[var(--ong-purple)] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Idade Máxima
              </label>
              <input
                type="number"
                value={tempFilters.maxAge || ''}
                onChange={(e) =>
                  setTempFilters({
                    ...tempFilters,
                    maxAge: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="20"
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[var(--ong-purple)] focus:ring-1 focus:ring-[var(--ong-purple)] focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="primary"
              onClick={handleApplyFilters}
              disabled={isLoading}
            >
              Aplicar Filtros
            </Button>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={
                Object.keys(tempFilters).length === 0 &&
                Object.keys(filters).length === 0
              }
            >
              Limpar Filtros
            </Button>
          </div>
        </div>

        {/* Animals Grid */}
        {animals.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-md">
            <div className="text-gray-500">
              <p className="text-lg font-semibold">Nenhum animal encontrado</p>
              <p className="mt-2 text-sm">
                {Object.keys(filters).length > 0
                  ? 'Tente ajustar os filtros ou clique em "Limpar Filtros"'
                  : 'Clique em "Novo Animal" para adicionar um'}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {animals.map((animal) => (
              <div
                key={animal.uuid}
                className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
              >
                {/* Imagem */}
                <div className="relative h-48 bg-gray-200">
                  {animal.photos && animal.photos.length > 0 ? (
                    <div className="w-full">
                      <Image
                        src={getFullImageUrl(animal.photos[0].photo_url)}
                        alt={animal.name}
                        className="h-full w-full object-cover"
                        width={0}
                        height={0}
                        sizes="100vh"
                        fill
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          // Evitar loop infinito - só muda se não for já o placeholder
                          if (!target.src.includes('data:image')) {
                            target.onerror = null; // Remove handler para evitar loop
                            target.src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="60%25" text-anchor="middle" fill="%236b7280" font-size="16"%3ESem imagem%3C/text%3E%3C/svg%3E';
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg
                        className="h-24 w-24 text-gray-400"
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
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {animal.name}
                  </h3>
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
                    <span className="rounded-full bg-[var(--ong-purple-50)] px-2 py-1 text-[var(--ong-purple)]">
                      {getTypeLabel(animal.type)}
                    </span>
                    <span>•</span>
                    <span>{animal.breed}</span>
                    <span>•</span>
                    <span>
                      {animal.age} {animal.age === 1 ? 'ano' : 'anos'}
                    </span>
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                    {animal.description}
                  </p>

                  {/* Tags */}
                  {animal.tags && animal.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {animal.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full px-2 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      onClick={() => router.push(`/animals/${animal.uuid}`)}
                      className="flex-1 !px-4 !py-2 text-sm"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setAnimalToDelete(animal)}
                      className="!border-red-600 !px-4 !py-2 text-sm !text-red-600 hover:!bg-red-600 hover:!text-white"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Confirmação de Exclusão */}
      {animalToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Confirmar Exclusão
            </h3>
            <p className="mb-6 text-gray-600">
              Tem certeza que deseja deletar o animal{' '}
              <strong>{animalToDelete.name}</strong>? Esta ação não pode ser
              desfeita.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setAnimalToDelete(null)}>
                Cancelar
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleDelete(animalToDelete)}
              >
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
