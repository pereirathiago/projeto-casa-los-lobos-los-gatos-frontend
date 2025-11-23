'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../../assets/icons/logo-ong.svg';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { apiService, Sponsor } from '../../../services/api';
import { authService } from '../../../services/auth';

export default function EditSponsorProfilePage() {
  const router = useRouter();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
        setFormData({
          name: profile.name,
          email: profile.email,
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar perfil');
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não conferem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const token = authService.getToken();
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
        return;
      }

      const updateData: {
        name: string;
        email: string;
        password?: string;
      } = {
        name: formData.name,
        email: formData.email,
      };

      // Só incluir senha se foi preenchida
      if (formData.password) {
        updateData.password = formData.password;
      }

      await apiService.updateMySponsorProfile(token, updateData);

      // Atualizar dados no storage
      await authService.refreshSponsorUser(apiService);

      toast.success('Perfil atualizado com sucesso!');
      router.push('/sponsor/profile');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(
        error instanceof Error ? error.message : 'Erro ao atualizar perfil',
      );
    } finally {
      setIsSaving(false);
    }
  };

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
                  {sponsor?.name}
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
          <button
            onClick={() => router.push('/sponsor/profile')}
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
            Voltar ao Perfil
          </button>
          <h1 className="text-3xl font-bold text-[var(--ong-purple)] sm:text-4xl">
            Editar Perfil
          </h1>
          <p className="mt-2 text-gray-600">
            Atualize suas informações de conta
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg bg-white p-6 shadow-md sm:p-8">
          {/* Badge de tipo de conta */}
          <div className="mb-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ong-orange)] px-3 py-1 text-sm font-semibold text-white">
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
            {sponsor?.active && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Conta Ativa
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nome Completo *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              error={errors.name}
              disabled={isSaving}
            />

            <Input
              label="E-mail *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              error={errors.email}
              disabled={isSaving}
            />

            <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center text-sm font-semibold text-gray-700">
                <svg
                  className="mr-2 h-5 w-5 text-[var(--ong-orange)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Alterar Senha (Opcional)
              </h3>
              <p className="mb-4 text-xs text-gray-500">
                Deixe em branco se não quiser alterar a senha. Ao alterar, você
                precisará fazer login novamente.
              </p>

              <div className="space-y-4">
                <Input
                  label="Nova Senha"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  error={errors.password}
                  disabled={isSaving}
                />

                <Input
                  label="Confirmar Nova Senha"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  error={errors.confirmPassword}
                  disabled={isSaving}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/sponsor/profile')}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" isLoading={isSaving} disabled={isSaving}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
