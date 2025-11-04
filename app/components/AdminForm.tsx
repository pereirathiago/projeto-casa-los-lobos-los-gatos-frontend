'use client';

import { useState, FormEvent, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import Alert from './Alert';
import { Admin, CreateAdminData, UpdateAdminData } from '../services/api';

interface AdminFormProps {
  admin?: Admin | null;
  onSubmit: (data: CreateAdminData | UpdateAdminData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function AdminForm({
  admin,
  onSubmit,
  onCancel,
  isLoading,
}: AdminFormProps) {
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    password: '',
    active: admin?.active ?? true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        password: '',
        active: admin.active,
      });
    }
  }, [admin]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Nome: obrigatório na criação, mínimo 3 caracteres
    if (!admin && !formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim() && formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter no mínimo 3 caracteres';
    }

    // Email: obrigatório na criação, validar formato
    if (!admin && !formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'E-mail inválido';
      }
    }

    // Senha: obrigatória na criação, mínimo 6 caracteres
    if (!admin && !formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) {
      setAlert({
        type: 'error',
        message: 'Por favor, corrija os erros antes de continuar',
      });
      return;
    }

    try {
      // Se está editando, enviar apenas campos modificados
      if (admin) {
        const updateData: UpdateAdminData = {};
        if (formData.name !== admin.name) updateData.name = formData.name;
        if (formData.email !== admin.email) updateData.email = formData.email;
        if (formData.password) updateData.password = formData.password;
        if (formData.active !== admin.active)
          updateData.active = formData.active;

        await onSubmit(updateData);
      } else {
        // Criando novo admin
        const createData: CreateAdminData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };
        await onSubmit(createData);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao salvar administrador';
      setAlert({
        type: 'error',
        message: errorMessage,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <Input
        label="Nome *"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Nome completo do administrador"
        error={errors.name}
        disabled={isLoading}
      />

      <Input
        label="E-mail *"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="email@exemplo.com"
        error={errors.email}
        disabled={isLoading}
      />

      <Input
        label={admin ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder={admin ? 'Apenas se quiser alterar' : 'Mínimo 6 caracteres'}
        error={errors.password}
        disabled={isLoading}
      />

      {admin && (
        <div className="mb-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-5 w-5 rounded border-gray-300 text-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)]"
            />
            <span className="text-sm font-medium text-gray-700">
              Administrador ativo
            </span>
          </label>
          <p className="mt-1 text-xs text-gray-500">
            Desmarque para desativar o acesso deste administrador
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {admin ? 'Atualizar' : 'Criar'} Administrador
        </Button>
      </div>
    </form>
  );
}
