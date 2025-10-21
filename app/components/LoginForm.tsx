'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import logo from '../assets/icons/logo-ong.svg';
import Alert from '../components/Alert';
import Button from '../components/Button';
import Input from '../components/Input';
import { apiService } from '../services/api';
import { authService } from '../services/auth';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
    setError('');

    // Validar formulário
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Fazer login
      const response = await apiService.login({ email, password });

      // Salvar dados de autenticação
      authService.saveAuth(response);

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao fazer login. Tente novamente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src={logo}
              alt="Logo Casa Los Lobos e Los Gatos"
              width={200}
              height={100}
              priority
            />
          </div>
          <p className="text-lg text-gray-600">Acesse sua conta</p>
        </div>

        {/* Alerta de erro */}
        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

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

          <div className="mb-6 flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 focus:ring-[var(--ong-purple)]"
                style={{ accentColor: 'var(--ong-purple)' }}
              />
              <span className="ml-2 text-sm text-gray-600">Lembrar-me</span>
            </label>
            <a
              href="#"
              className="text-sm font-medium text-[var(--ong-purple)] hover:underline"
            >
              Esqueceu a senha?
            </a>
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
          <p className="text-sm text-gray-600">
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
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
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
