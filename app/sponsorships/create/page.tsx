'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Estados para busca de padrinho
  const [sponsorEmail, setSponsorEmail] = useState('');
  const [sponsorSearching, setSponsorSearching] = useState(false);
  const [foundSponsor, setFoundSponsor] = useState<Sponsor | null>(null);
  const [sponsorNotFound, setSponsorNotFound] = useState(false);

  // Estado para animal selecionado
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const sourcePage = searchParams.get('source');
  const backLink =
    sourcePage === 'sponsors'
      ? { href: '/sponsors', label: 'Voltar para Padrinhos' }
      : { href: '/sponsorships', label: 'Voltar para Apadrinhamentos' };

  const handleSearchSponsor = useCallback(
    async (emailToSearch?: string) => {
      const email = emailToSearch || sponsorEmail;

      if (!email.trim()) {
        toast.error('Digite um email para buscar');
        return;
      }

      try {
        setSponsorSearching(true);
        setSponsorNotFound(false);
        setFoundSponsor(null);

        const token = authService.getToken();
        if (!token) return;

        const result = await apiService.searchSponsorByEmail(token, email);

        // A API pode retornar um objeto único ou um array
        const sponsors = Array.isArray(result) ? result : [result];

        if (sponsors.length > 0 && sponsors[0]) {
          const sponsor = sponsors[0];

          // Verificar se tem as propriedades active e deleted, senão assumir como ativo
          const isActive = sponsor.active !== undefined ? sponsor.active : true;
          const isDeleted =
            sponsor.deleted !== undefined ? sponsor.deleted : false;

          if (!isActive || isDeleted) {
            toast.error('Este padrinho não está ativo');
            setSponsorNotFound(true);
            return;
          }

          setFoundSponsor(sponsor);
          setFormData((prev) => ({ ...prev, userId: sponsor.uuid }));
        } else {
          setSponsorNotFound(true);
        }
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Erro ao buscar padrinho',
        );
        setSponsorNotFound(true);
      } finally {
        setSponsorSearching(false);
      }
    },
    [sponsorEmail],
  );

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
      await loadInitialData();

      // Verificar se há email na URL e buscar automaticamente
      const emailParam = searchParams.get('email');
      if (emailParam) {
        setSponsorEmail(emailParam);
        // Pequeno delay para garantir que os dados foram carregados e passar o email diretamente
        setTimeout(() => {
          handleSearchSponsor(emailParam);
        }, 500);
      }
    }

    init();
  }, [router, searchParams, handleSearchSponsor]);

  const loadInitialData = async () => {
    try {
      setIsLoadingData(true);
      const token = authService.getToken();
      if (!token) return;

      const animalsData = await apiService.getAnimals(token);
      setAnimals(animalsData);
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

    // Validações
    if (!foundSponsor || !formData.userId) {
      toast.error('Busque e confirme um padrinho válido');
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
            {/* Sponsor Search */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Padrinho/Madrinha *
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={sponsorEmail}
                  onChange={(e) => {
                    setSponsorEmail(e.target.value);
                    setFoundSponsor(null);
                    setSponsorNotFound(false);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchSponsor();
                    }
                  }}
                  placeholder="Digite o email do padrinho"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSearchSponsor()}
                  disabled={
                    !!sponsorSearching ||
                    !sponsorEmail.trim() ||
                    !!(
                      foundSponsor && foundSponsor.email === sponsorEmail.trim()
                    )
                  }
                  className="rounded-lg bg-[var(--ong-purple)] px-6 py-2 text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sponsorSearching ? 'Buscando...' : 'Buscar'}
                </button>
              </div>

              {/* Sponsor Found Card */}
              {foundSponsor && (
                <div className="mt-3 rounded-lg border-2 border-green-500 bg-green-50 p-4">
                  <div className="flex items-start">
                    <svg
                      className="mr-3 h-6 w-6 flex-shrink-0 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">
                        Padrinho Encontrado
                      </h4>
                      <p className="mt-1 text-sm text-green-800">
                        <span className="font-medium">{foundSponsor.name}</span>
                      </p>
                      <p className="text-sm text-green-700">
                        {foundSponsor.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sponsor Not Found */}
              {sponsorNotFound && (
                <div className="mt-3 rounded-lg border-2 border-red-500 bg-red-50 p-4">
                  <div className="flex items-start">
                    <svg
                      className="mr-3 h-6 w-6 flex-shrink-0 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-red-900">
                        Padrinho Não Encontrado
                      </h4>
                      <p className="mt-1 text-sm text-red-800">
                        Nenhum padrinho ativo encontrado com este email.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

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

              {/* Suggested Amounts */}
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
                !foundSponsor ||
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
