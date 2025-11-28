'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../assets/icons/logo-ong.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Admin, apiService, UpdateAdminData } from '../../services/api';
import { authService } from '../../services/auth';

export default function EditProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    is_master?: boolean;
  } | null>(null);
  const [adminData, setAdminData] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      // Verificar autenticação
      if (!authService.isAuthenticated()) {
        toast.error('Acesso negado. Por favor, faça login para continuar.');
        router.push('/login');
        return;
      }

      const token = authService.getToken();
      const userData = authService.getUser();

      if (!token || !userData || userData.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      setUser(userData);

      // Buscar dados completos do admin usando a rota /me
      const myProfile = await apiService.getMyProfile(token);
      setAdminData(myProfile);

      // Preencher formulário
      setFormData({
        name: myProfile.name,
        email: myProfile.email,
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao carregar perfil';
      toast.error(errorMessage);
      router.push('/profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    authService.clearAuth();
    router.push('/login');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Nome: mínimo 3 caracteres
    if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
    }

    // Email: validar formato
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }
    }

    // Senha: se preenchida, mínimo 6 caracteres
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      }

      // Confirmar senha
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros antes de continuar');
      return;
    }

    try {
      setIsSaving(true);
      const token = authService.getToken();
      if (!token) throw new Error('Token não encontrado');

      // Preparar dados para envio
      const updateData: UpdateAdminData = {};
      if (formData.name !== adminData?.name) updateData.name = formData.name;
      if (formData.email !== adminData?.email)
        updateData.email = formData.email;
      if (formData.password) updateData.password = formData.password;

      // Se não há mudanças
      if (Object.keys(updateData).length === 0) {
        toast.error('Nenhuma alteração foi feita');
        return;
      }

      await apiService.updateMyProfile(token, updateData);
      toast.success('Perfil atualizado com sucesso!');

      // Se alterou senha, fazer logout para logar novamente
      if (formData.password) {
        toast.success('Senha alterada! Por favor, faça login novamente.');
        setTimeout(() => {
          authService.clearAuth();
          router.push('/login');
        }, 2000);
      } else {
        // Se alterou email ou nome, atualizar dados salvos
        if (updateData.name || updateData.email) {
          const updatedUser = {
            ...authService.getUser()!,
            name: updateData.name || adminData!.name,
            email: updateData.email || adminData!.email,
          };
          // Manter a preferência de lembrar-me existente
          const wasRemembered =
            localStorage.getItem('ong_remember_me') === 'true';
          authService.saveAuth(
            {
              token: token,
              user: updatedUser,
            },
            wasRemembered,
          );
        }
        router.push('/profile');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
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

  if (!adminData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">
            Não foi possível carregar o perfil
          </p>
          <Button onClick={() => router.push('/profile')} className="mt-4">
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
                <p className="text-xs text-gray-500">
                  {user?.is_master ? 'Master Admin' : 'Administrador'}
                </p>
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
          <Link
            href="/profile"
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
          </Link>
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
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ong-purple)] px-3 py-1 text-sm font-semibold text-white">
              {adminData.is_master ? (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Master Admin
                </>
              ) : (
                <>
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Administrador
                </>
              )}
            </span>
            {adminData.active && (
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
              onChange={handleInputChange}
              placeholder="Seu nome completo"
              error={errors.name}
              disabled={isSaving}
            />

            <Input
              label="E-mail *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              error={errors.email}
              disabled={isSaving}
            />

            <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 flex items-center text-sm font-semibold text-gray-700">
                <svg
                  className="mr-2 h-5 w-5 text-[var(--ong-purple)]"
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
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  error={errors.password}
                  disabled={isSaving}
                />

                <Input
                  label="Confirmar Nova Senha"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Digite a senha novamente"
                  error={errors.confirmPassword}
                  disabled={isSaving}
                />
              </div>
            </div>

            {adminData.is_master && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex">
                  <svg
                    className="h-5 w-5 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-semibold text-yellow-800">
                      Conta Master Admin
                    </h3>
                    <p className="mt-1 text-xs text-yellow-700">
                      Você não pode desativar sua própria conta Master Admin por
                      questões de segurança.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/profile')}
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
