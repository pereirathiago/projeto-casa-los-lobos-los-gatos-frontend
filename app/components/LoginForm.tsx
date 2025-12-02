'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import logo from '../assets/icons/logo-ong.svg';
import Button from '../components/Button';
import Input from '../components/Input';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const validateForm = (): boolean => {
    const errors = { email: '', password: '' };
    let isValid = true;

    // Validar email
    if (!email) {
      errors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'E-mail inválido';
      isValid = false;
    }

    // Validar senha
    if (!password) {
      errors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validar formulário
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros antes de continuar');
      return;
    }

    setIsLoading(true);

    try {
      // Fazer login
      const response = await apiService.login({ email, password });

      // Salvar dados de autenticação com preferência de lembrar
      authService.saveAuth(response, rememberMe);

      // Mostrar sucesso e redirecionar
      toast.success('Login realizado com sucesso!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Erro ao fazer login. Tente novamente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        {/* Logo */}
        <div className="mb-6 text-center sm:mb-8">
          <div className="mb-4 flex justify-center sm:mb-6">
            <Link href="/">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={160}
                height={80}
                className="sm:h-[100px] sm:w-[200px]"
                priority
              />
            </Link>
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-800 sm:text-2xl">
            Acesse sua conta
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Para usar os recursos da plataforma
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors({ ...fieldErrors, email: '' });
            }}
            placeholder="seu@email.com"
            error={fieldErrors.email}
            disabled={isLoading}
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors({ ...fieldErrors, password: '' });
            }}
            placeholder="••••••••"
            error={fieldErrors.password}
            disabled={isLoading}
          />

          <div className="mb-6 flex items-center">
            <label className="flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 focus:ring-[var(--ong-purple)] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ accentColor: 'var(--ong-purple)' }}
              />
              <span className="ml-2 text-xs text-gray-600 sm:text-sm">
                Lembrar-me
              </span>
            </label>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Entrar
          </Button>
        </form>

        {/* Link para registro */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 sm:text-sm">
            Ainda não tem uma conta?{' '}
            <Link
              href="/register"
              className="font-medium text-[var(--ong-purple)] hover:underline"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="mt-4 text-center sm:mt-6">
        <p className="text-xs text-gray-500 sm:text-sm">
          Ao fazer login, você concorda com nossos{' '}
          <a href="#" className="underline hover:text-gray-700">
            Termos de Uso
          </a>
          {' e '}
          <a href="#" className="underline hover:text-gray-700">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  );
}
