'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { toast } from 'sonner';
import logo from '../../../assets/icons/logo-ong.svg';
import Button from '../../../components/Button';
import {
  apiService,
  type Animal,
  type Sponsorship,
  type UpdateSponsorshipData,
} from '../../../services/api';
import { authService } from '../../../services/auth';

export default function EditSponsorshipPage() {
  const router = useRouter();
  const params = useParams();
  const uuid = params?.uuid as string;

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [sponsorship, setSponsorship] = useState<Sponsorship | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [formData, setFormData] = useState<UpdateSponsorshipData>({
    animalId: '',
    monthlyAmount: 0,
    active: true,
  });
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const loadDataWrapper = async () => {
      try {
        setIsLoadingData(true);

        if (!authService.isAuthenticated()) {
          toast.error('Acesso negado. Por favor, faça login para continuar.');
          router.push('/login');
          return;
        }

        const userData = await authService.refreshAdminUser(apiService);

        if (userData?.role !== 'admin') {
          toast.error('Acesso restrito a administradores.');
          router.push('/dashboard');
          return;
        }

        setUser(userData);

        if (!uuid) return;

        const token = authService.getToken();
        if (!token) return;

        const [sponsorshipData, animalsData] = await Promise.all([
          apiService.getSponsorshipByUuid(token, uuid),
          apiService.getAnimals(token),
        ]);

        setSponsorship(sponsorshipData);
        setAnimals(animalsData);

        setFormData({
          animalId: sponsorshipData.animal.uuid,
          monthlyAmount: sponsorshipData.monthlyAmount,
          active: sponsorshipData.active,
        });

        // Find the full Animal object by uuid to satisfy the Animal type
        const foundAnimal = animalsData.find(
          (animal) => animal.uuid === sponsorshipData.animal.uuid,
        );
        setSelectedAnimal(foundAnimal ?? null);
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : 'Erro ao carregar apadrinhamento',
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    loadDataWrapper();
  }, [router, uuid]);

  const loadAnimalOptions = (inputValue: string) => {
    return new Promise<Array<{ value: string; label: string; animal: Animal }>>(
      (resolve) => {
        if (!inputValue || inputValue.length < 2) {
          resolve([]);
          return;
        }

        const filtered = animals
          .filter((animal) =>
            animal.name.toLowerCase().includes(inputValue.toLowerCase()),
          )
          .map((animal) => ({
            value: animal.uuid,
            label: `${animal.name} - ${animal.breed} (${animal.type === 'dog' ? 'Cão' : 'Gato'})`,
            animal,
          }));

        resolve(filtered);
      },
    );
  };

  const validateMonthlyAmount = (value: string): string | null => {
    const num = parseFloat(value);
    if (isNaN(num)) return 'Valor inválido';
    if (num < 0) return 'Valor deve ser maior ou igual a zero';
    if (!/^\d+(\.\d{1,2})?$/.test(value)) {
      return 'Use no máximo 2 casas decimais';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.animalId) {
      toast.error('Selecione um animal');
      return;
    }

    const amountError = validateMonthlyAmount(
      formData.monthlyAmount?.toString() || '0',
    );
    if (amountError) {
      toast.error(amountError);
      return;
    }

    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) return;

      await apiService.updateSponsorship(token, uuid, {
        ...formData,
        monthlyAmount: parseFloat(formData.monthlyAmount?.toString() || '0'),
      });

      toast.success('Apadrinhamento atualizado com sucesso');
      router.push('/sponsorships');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao atualizar apadrinhamento',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    authService.clearAuth();
    router.push('/login');
  };

  const suggestedAmounts = [50, 100, 150, 200];

  if (isLoadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-[var(--ong-purple)]"></div>
      </div>
    );
  }

  if (!sponsorship) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Apadrinhamento não encontrado</p>
          <Button onClick={() => router.push('/sponsorships')} className="mt-4">
            Voltar
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
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <Link
            href="/sponsorships"
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
            Voltar para Apadrinhamentos
          </Link>
          <h1 className="text-3xl font-bold text-[var(--ong-purple)] sm:text-4xl">
            Editar Apadrinhamento
          </h1>
          <p className="mt-2 text-gray-600">
            Atualize as informações do apadrinhamento
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Informações Atuais
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-500">Padrinho</p>
              <p className="mt-1 text-sm text-gray-900">
                {sponsorship.user.name}
              </p>
              <p className="text-xs text-gray-500">{sponsorship.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Data de Cadastro
              </p>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(sponsorship.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            * O padrinho não pode ser alterado após a criação
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-6 shadow"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Animal *
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions={false}
                loadOptions={loadAnimalOptions}
                value={
                  selectedAnimal
                    ? {
                        value: selectedAnimal.uuid,
                        label: `${selectedAnimal.name} - ${selectedAnimal.breed} (${selectedAnimal.type === 'dog' ? 'Cão' : 'Gato'})`,
                        animal: selectedAnimal,
                      }
                    : null
                }
                onChange={(option) => {
                  if (option) {
                    setSelectedAnimal(option.animal);
                    setFormData({ ...formData, animalId: option.value });
                  } else {
                    setSelectedAnimal(null);
                    setFormData({ ...formData, animalId: '' });
                  }
                }}
                placeholder="Digite o nome do animal para buscar..."
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 2
                    ? 'Digite pelo menos 2 caracteres'
                    : 'Nenhum animal encontrado'
                }
                loadingMessage={() => 'Buscando...'}
                isClearable
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#d1d5db',
                    borderRadius: '0.5rem',
                    padding: '0.125rem',
                    '&:hover': {
                      borderColor: '#472B74',
                    },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? '#f3e8ff' : 'white',
                    color: '#1f2937',
                    '&:hover': {
                      backgroundColor: '#f3e8ff',
                    },
                  }),
                }}
              />
              <p className="mt-2 text-sm text-gray-500">
                Digite o nome do animal para pesquisar na lista.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Valor Mensal da Doação (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.monthlyAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyAmount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="150.00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Valor que o padrinho irá doar mensalmente. Use até 2 casas
                decimais.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Sugestões:</span>
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, monthlyAmount: amount })
                    }
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-[var(--ong-purple)] hover:text-white"
                  >
                    R$ {amount},00
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-[var(--ong-purple)] focus:ring-[var(--ong-purple)]"
              />
              <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                Apadrinhamento ativo
              </label>
            </div>

            {formData.monthlyAmount && formData.monthlyAmount > 0 && (
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Valor mensal:</span>{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(formData.monthlyAmount)}
                  /mês
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Valor anual estimado:{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(formData.monthlyAmount * 12)}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/sponsorships')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
