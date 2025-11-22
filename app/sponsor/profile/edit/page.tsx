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
            <div className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={140}
                height={70}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/sponsor/profile')}
              >
                Cancelar
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--ong-purple)]">
            Editar Perfil
          </h1>
          <p className="mt-2 text-gray-600">
            Atualize suas informações pessoais
          </p>
        </div>

        {/* Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-6 shadow-md"
        >
          <div className="mb-6 flex items-center space-x-4 border-b pb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--ong-purple)] text-3xl font-bold text-white">
              {formData.name.charAt(0).toUpperCase() || 'P'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {formData.name || 'Padrinho'}
              </h2>
              <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                Padrinho
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div className="border-t pt-4">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">
                Alterar Senha (Opcional)
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Deixe em branco se não quiser alterar a senha
              </p>

              <div className="space-y-4">
                <Input
                  label="Nova Senha"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Mínimo 6 caracteres"
                />

                <Input
                  label="Confirmar Nova Senha"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Digite a senha novamente"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/sponsor/profile')}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
