'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { toast } from 'sonner';
import logo from '../../assets/icons/logo-ong.svg';
import Button from '../../components/Button';
import {
  apiService,
  type Animal,
  type CreateSponsorshipData,
  type Sponsor,
} from '../../services/api';
import { authService } from '../../services/auth';

function CreateSponsorshipForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  const [formData, setFormData] = useState<CreateSponsorshipData>({
    userId: '',
    animalId: '',
    monthlyAmount: 0,
  });

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const sourcePage = searchParams.get('source');
  const backLink =
    sourcePage === 'sponsors'
      ? { href: '/sponsors', label: 'Voltar para Padrinhos' }
      : { href: '/sponsorships', label: 'Voltar para Apadrinhamentos' };

  useEffect(() => {
    async function init() {
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

      const emailParam = searchParams.get('email');
      await loadInitialData(emailParam);
    }

    init();
     
  }, [router, searchParams]);

  const loadInitialData = async (emailParam?: string | null) => {
    try {
      setIsLoadingData(true);
      const token = authService.getToken();
      if (!token) return;

      const [animalsData, sponsorsData] = await Promise.all([
        apiService.getAnimals(token),
        apiService.getAllSponsors(token),
      ]);

      setAnimals(animalsData);
      setSponsors(sponsorsData);

      // Se vier email na URL, pré-seleciona o padrinho correspondente (ativo e não deletado)
      if (emailParam) {
        const sponsorFromParam = sponsorsData.find(
          (s) =>
            s.email.toLowerCase() === emailParam.toLowerCase() &&
            s.active &&
            !s.deleted,
        );

        if (sponsorFromParam) {
          setSelectedSponsor(sponsorFromParam);
          setFormData((prev) => ({
            ...prev,
            userId: sponsorFromParam.uuid,
          }));
        } else {
          toast.error(
            'Nenhum padrinho ativo encontrado para o email informado.',
          );
        }
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao carregar dados',
      );
    } finally {
      setIsLoadingData(false);
    }
  };

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
            label: `${animal.name} - ${animal.breed} (${
              animal.type === 'dog' ? 'Cão' : 'Gato'
            })`,
            animal,
          }));

        resolve(filtered);
      },
    );
  };

  const loadSponsorOptions = (inputValue: string) => {
    return new Promise<
      Array<{ value: string; label: string; sponsor: Sponsor }>
    >((resolve) => {
      if (!inputValue || inputValue.length < 2) {
        resolve([]);
        return;
      }

      const normalizedInput = inputValue.toLowerCase();
      const filtered = sponsors
        .filter(
          (sponsor) =>
            sponsor.name.toLowerCase().includes(normalizedInput) ||
            sponsor.email.toLowerCase().includes(normalizedInput),
        )
        .filter((sponsor) => sponsor.active && !sponsor.deleted)
        .map((sponsor) => ({
          value: sponsor.uuid,
          label: `${sponsor.name} • ${sponsor.email}`,
          sponsor,
        }));

      resolve(filtered);
    });
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

    // Validações
    if (!selectedSponsor || !formData.userId) {
      toast.error('Selecione um padrinho válido');
      return;
    }

    if (!selectedAnimal || !formData.animalId) {
      toast.error('Selecione um animal');
      return;
    }

    const amountError = validateMonthlyAmount(
      formData.monthlyAmount.toString(),
    );
    if (amountError) {
      toast.error(amountError);
      return;
    }

    try {
      setIsLoading(true);
      const token = authService.getToken();
      if (!token) return;

      await apiService.createSponsorship(token, {
        ...formData,
        monthlyAmount: parseFloat(formData.monthlyAmount?.toString() || '0'),
      });

      toast.success('Apadrinhamento criado com sucesso');
      router.push('/sponsorships');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Erro ao criar apadrinhamento',
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
            href={backLink.href}
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
            {backLink.label}
          </Link>

          <h1 className="text-3xl font-bold text-[var(--ong-purple)] sm:text-4xl">
            Novo Apadrinhamento
          </h1>
          <p className="mt-2 text-gray-600">
            Cadastre um novo apadrinhamento conectando um padrinho a um animal
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-6 shadow"
        >
          <div className="space-y-6">
            {/* Sponsor AsyncSelect */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Padrinho/Madrinha *
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions={false}
                loadOptions={loadSponsorOptions}
                value={
                  selectedSponsor
                    ? {
                        value: selectedSponsor.uuid,
                        label: `${selectedSponsor.name} • ${selectedSponsor.email}`,
                        sponsor: selectedSponsor,
                      }
                    : null
                }
                onChange={(option) => {
                  if (option) {
                    setSelectedSponsor(option.sponsor);
                    setFormData((prev) => ({
                      ...prev,
                      userId: option.value,
                    }));
                  } else {
                    setSelectedSponsor(null);
                    setFormData((prev) => ({
                      ...prev,
                      userId: '',
                    }));
                  }
                }}
                placeholder="Digite o nome ou email do padrinho..."
                noOptionsMessage={({ inputValue }) =>
                  inputValue.length < 2
                    ? 'Digite pelo menos 2 caracteres'
                    : 'Nenhum padrinho ativo encontrado'
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
                Digite o nome ou email para pesquisar. Apenas padrinhos ativos
                serão exibidos.
              </p>
              {sponsors.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Nenhum padrinho cadastrado no sistema.
                </p>
              )}
            </div>

            {selectedSponsor && (
              <div className="rounded-lg bg-purple-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-[var(--ong-purple)]">
                  Padrinho selecionado
                </p>
                <p>{selectedSponsor.name}</p>
                <p className="text-gray-600">{selectedSponsor.email}</p>
                <p className="mt-2 text-xs text-gray-500">
                  Status:{' '}
                  {selectedSponsor.deleted
                    ? 'Removido'
                    : selectedSponsor.active
                      ? 'Ativo'
                      : 'Inativo'}
                </p>
              </div>
            )}

            {/* Animal AsyncSelect */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Animal *
              </label>
              <AsyncSelect
                cacheOptions
                defaultOptions={false}
                loadOptions={loadAnimalOptions}
                onChange={(option) => {
                  if (option) {
                    setSelectedAnimal(option.animal);
                    setFormData((prev) => ({
                      ...prev,
                      animalId: option.value,
                    }));
                  } else {
                    setSelectedAnimal(null);
                    setFormData((prev) => ({ ...prev, animalId: '' }));
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
              {animals.length === 0 && (
                <p className="mt-2 text-sm text-red-600">
                  Nenhum animal disponível. Cadastre animais primeiro.
                </p>
              )}
            </div>

            {/* Monthly Amount */}
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
                  setFormData((prev) => ({
                    ...prev,
                    monthlyAmount: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="150.00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Valor que o padrinho irá doar mensalmente. Use até 2 casas
                decimais.
              </p>

              {/* Suggested Amounts */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Sugestões:</span>
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        monthlyAmount: amount,
                      }))
                    }
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-[var(--ong-purple)] hover:text-white"
                  >
                    R$ {amount},00
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            {formData.monthlyAmount > 0 && (
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
            <Button
              type="submit"
              disabled={
                isLoading ||
                !selectedSponsor ||
                !selectedAnimal ||
                animals.length === 0
              }
            >
              {isLoading ? 'Criando...' : 'Criar Apadrinhamento'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default function CreateSponsorshipPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-[var(--ong-purple)]"></div>
        </div>
      }
    >
      <CreateSponsorshipForm />
    </Suspense>
  );
}
