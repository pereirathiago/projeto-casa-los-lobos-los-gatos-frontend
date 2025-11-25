'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../../assets/icons/logo-ong.svg';
import Button from '../../../components/Button';
import { apiService } from '../../../services/api';
import { authService } from '../../../services/auth';

const getTodayInputValue = () => new Date().toISOString().split('T')[0];

export default function NewSponsorDonationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    donationDate: getTodayInputValue(),
    notes: '',
  });

  useEffect(() => {
    async function init() {
      if (!authService.isAuthenticated()) {
        toast.error('Acesso negado. Faça login para continuar.');
        router.push('/login');
        return;
      }

      const sponsorUser = await authService.refreshSponsorUser(apiService);
      if (!sponsorUser || sponsorUser.role !== 'sponsor') {
        toast.error('Acesso exclusivo para padrinhos.');
        router.push('/dashboard');
        return;
      }

      setUserName(sponsorUser.name);
    }

    init();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const amountNumber = parseFloat(formData.amount);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Informe um valor válido maior que zero.');
      return;
    }

    if (!formData.donationDate) {
      toast.error('Selecione a data da doação.');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = authService.getToken();
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
        return;
      }

      const donationDateISO = new Date(formData.donationDate).toISOString();

      await apiService.createSponsorDonation(token, {
        amount: Number(amountNumber.toFixed(2)),
        donationDate: donationDateISO,
        notes: formData.notes.trim() || undefined,
      });

      toast.success('Doação registrada com sucesso!');
      router.push('/sponsor/donations');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao registrar doação';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={140}
                height={70}
              />
            </Link>
            <Button
              variant="outline"
              onClick={() => router.push('/sponsor/donations')}
            >
              Ver Minhas Doações
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/sponsor/donations"
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
            Voltar para Minhas Doações
          </Link>

          <h1 className="text-3xl font-bold text-[var(--ong-purple)]">
            Registrar Nova Doação
          </h1>
          <p className="mt-2 text-gray-600">
            Obrigado, {userName || 'padrinho'}, por continuar apoiando nossa
            causa. Preencha os dados da sua doação abaixo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-6 shadow"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Valor da Doação (R$) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: event.target.value,
                  }))
                }
                placeholder="150,00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Informe o valor exato que você transferiu/transferirá.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Data da Doação *
              </label>
              <input
                type="date"
                value={formData.donationDate}
                max={getTodayInputValue()}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    donationDate: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Utilize a data em que o depósito/transferência foi realizado.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                value={formData.notes}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
                placeholder="Ex.: Depósito via PIX, banco, comprovante enviado por e-mail..."
                className="h-28 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
              />
              <p className="mt-2 text-sm text-gray-500">
                Campo opcional para informar detalhes que facilitem nossa
                confirmação.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/sponsor/donations')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registrando...' : 'Registrar Doação'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
