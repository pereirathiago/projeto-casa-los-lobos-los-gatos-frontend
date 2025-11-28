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

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Função para calcular força da senha
  const getPasswordStrength = (
    pwd: string,
  ): { strength: number; text: string; color: string } => {
    if (pwd.length === 0) return { strength: 0, text: '', color: '' };

    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;

    if (strength <= 1)
      return { strength: 25, text: 'Fraca', color: 'bg-red-500' };
    if (strength === 2)
      return { strength: 50, text: 'Média', color: 'bg-yellow-500' };
    if (strength === 3)
      return { strength: 75, text: 'Boa', color: 'bg-blue-500' };
    return { strength: 100, text: 'Forte', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    let isValid = true;

    // Validar nome
    if (!name.trim()) {
      errors.name = 'Nome é obrigatório';
      isValid = false;
    } else if (name.trim().length < 3) {
      errors.name = 'Nome deve ter no mínimo 3 caracteres';
      isValid = false;
    }

    // Validar email
    if (!email) {
      errors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Formato de e-mail inválido';
      isValid = false;
    }

    // Validar senha
    if (!password) {
      errors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Senha deve ter no mínimo 6 caracteres';
      isValid = false;
    } else if (password.length > 0 && !/(?=.*[a-zA-Z])/.test(password)) {
      errors.password = 'Senha deve conter pelo menos uma letra';
      isValid = false;
    }

    // Validar confirmação de senha
    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória';
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'As senhas não coincidem';
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
      // Fazer cadastro
      await apiService.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      // Mostrar mensagem de sucesso
      toast.success('Cadastro realizado com sucesso! Redirecionando...');

      // Limpar formulário
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Redirecionar para login
      router.push('/login');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Erro ao realizar cadastro. Tente novamente.',
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
            Criar Conta
          </h1>
          <p className="text-sm text-gray-600 sm:text-base">
            Cadastre-se para se tornar um padrinho
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome completo"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors({ ...fieldErrors, name: '' });
            }}
            placeholder="Seu nome completo"
            error={fieldErrors.name}
            disabled={isLoading}
          />

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
            placeholder="Mínimo 6 caracteres"
            error={fieldErrors.password}
            disabled={isLoading}
          />

          {/* Indicador de força da senha */}
          {password.length > 0 && (
            <div className="-mt-2 mb-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-gray-600">Força da senha:</span>
                <span
                  className={`text-xs font-semibold ${
                    passwordStrength.strength === 25
                      ? 'text-red-500'
                      : passwordStrength.strength === 50
                        ? 'text-yellow-500'
                        : passwordStrength.strength === 75
                          ? 'text-blue-500'
                          : 'text-green-500'
                  }`}
                >
                  {passwordStrength.text}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.strength}%` }}
                ></div>
              </div>
            </div>
          )}

          <Input
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setFieldErrors({ ...fieldErrors, confirmPassword: '' });
            }}
            placeholder="Digite a senha novamente"
            error={fieldErrors.confirmPassword}
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Criar Conta
          </Button>
        </form>

        {/* Link para login */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600 sm:text-sm">
            Já tem uma conta?{' '}
            <Link
              href="/login"
              className="font-medium text-[var(--ong-purple)] hover:underline"
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="mt-4 text-center sm:mt-6">
        <p className="text-xs text-gray-500 sm:text-sm">
          Ao se cadastrar, você concorda com nossos{' '}
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
