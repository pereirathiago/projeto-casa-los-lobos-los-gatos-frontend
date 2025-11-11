'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logo from '../assets/icons/logo-ong.svg';
import Alert from '../components/Alert';
import Button from '../components/Button';
import { Animal, AnimalFilters, apiService } from '../services/api';
import { authService } from '../services/auth';

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
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null);
  const [filters, setFilters] = useState<AnimalFilters>({});

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
    loadAnimals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, filters]);

  const loadAnimals = async () => {
    try {
      setIsLoading(true);
      const animalsList = await apiService.getAnimals(filters);
      console.log('Animals loaded:', animalsList); // Debug: verificar dados
      setAnimals(animalsList);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar animais';
      setAlert({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (animal: Animal) => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error('Token não encontrado');

      await apiService.deleteAnimal(token, animal.uuid);
      setAlert({
        type: 'success',
        message: 'Animal deletado com sucesso!',
      });
      setAnimalToDelete(null);
      loadAnimals();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao deletar animal';
      setAlert({
        type: 'error',
        message: errorMessage,
      });
    }
  };

  const handleLogout = async () => {
    authService.clearAuth();
    router.push('/login');
  };

  const getImageUrl = (photoUrl: string | null) => {
    if (!photoUrl) return '/placeholder-animal.jpg';
    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${photoUrl}`;
    console.log('Image URL:', url); // Debug: verificar URL gerada
    return url;
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

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Filtros */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-700">Filtros</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
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
                value={filters.breed || ''}
                onChange={(e) =>
                  setFilters({ ...filters, breed: e.target.value })
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
                value={filters.minAge || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
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
                value={filters.maxAge || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
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
              variant="outline"
              onClick={() => setFilters({})}
              disabled={Object.keys(filters).length === 0}
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
                  {animal.photo_url ? (
                    <Image
                      src={getImageUrl(animal.photo_url)}
                      alt={animal.name}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-animal.jpg';
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-6xl">
                      {animal.type === 'dog' ? '🐕' : '🐱'}
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
                    <button
                      onClick={() => router.push(`/animals/${animal.uuid}`)}
                      className="flex-1 rounded-md bg-[var(--ong-purple)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setAnimalToDelete(animal)}
                      className="rounded-md border-2 border-red-600 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                    >
                      Excluir
                    </button>
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
