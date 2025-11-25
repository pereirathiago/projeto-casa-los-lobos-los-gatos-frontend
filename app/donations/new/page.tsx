'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import logo from '../../assets/icons/logo-ong.svg';
import Button from '../../components/Button';
import type { Sponsor } from '../../services/api';
import { apiService } from '../../services/api';
import { authService } from '../../services/auth';

const getTodayInputValue = () => new Date().toISOString().split('T')[0];

export default function NewAdminDonationPage() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('Administrador');
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingSponsors, setIsLoadingSponsors] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sponsorUuid: '',
    amount: '',
    donationDate: getTodayInputValue(),
    notes: '',
  });

  const loadSponsors = useCallback(async () => {
    try {
      setIsLoadingSponsors(true);
      const token = authService.getToken();
      if (!token) {
        toast.error('Sessão expirada. Faça login novamente.');
        router.push('/login');
        return;
      }

      const response = await apiService.getAllSponsors(token);
      setSponsors(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao carregar padrinhos';
      toast.error(message);
    } finally {
      setIsLoadingSponsors(false);
    }
  }, [router]);

  useEffect(() => {
    async function init() {
      if (!authService.isAuthenticated()) {
        toast.error('Acesso negado. Faça login para continuar.');
        router.push('/login');
        return;
      }

      const adminUser = await authService.refreshAdminUser(apiService);
      if (!adminUser || adminUser.role !== 'admin') {
        toast.error('Acesso exclusivo para administradores.');
        router.push('/dashboard');
        return;
      }

      if (adminUser.name) {
        setAdminName(adminUser.name);
      }

      loadSponsors();
    }

    init();
  }, [router, loadSponsors]);

  const sortedSponsors = useMemo(() => {
    return [...sponsors].sort((a, b) => a.name.localeCompare(b.name));
  }, [sponsors]);

  const visibleSponsors = useMemo(() => {
    if (!searchTerm.trim()) {
      return sortedSponsors;
    }

    const normalizedTerm = searchTerm.toLowerCase();
    const filtered = sortedSponsors.filter((sponsor) =>
      `${sponsor.name} ${sponsor.email}`.toLowerCase().includes(normalizedTerm),
    );

    if (
      formData.sponsorUuid &&
      !filtered.some((sponsor) => sponsor.uuid === formData.sponsorUuid)
    ) {
      const selected = sortedSponsors.find(
        (sponsor) => sponsor.uuid === formData.sponsorUuid,
      );
      if (selected) {
        return [selected, ...filtered];
      }
    }

    return filtered;
  }, [sortedSponsors, searchTerm, formData.sponsorUuid]);

  const selectedSponsor = useMemo(() => {
    return (
      sponsors.find((sponsor) => sponsor.uuid === formData.sponsorUuid) || null
    );
  }, [sponsors, formData.sponsorUuid]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.sponsorUuid) {
      toast.error('Selecione um padrinho para vincular a doação.');
      return;
    }

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

      await apiService.createAdminDonation(token, {
        userId: formData.sponsorUuid,
        amount: Number(amountNumber.toFixed(2)),
        donationDate: donationDateISO,
        notes: formData.notes.trim() || undefined,
      });

      toast.success('Doação registrada com sucesso!');
      router.push('/donations');
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
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src={logo}
                alt="Logo Casa Los Lobos e Los Gatos"
                width={140}
                height={70}
              />
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/donations')}
              >
                Ver Doações
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/donations"
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
            Voltar para Doações
          </Link>

          <h1 className="text-3xl font-bold text-[var(--ong-purple)]">
            Registrar Doação Manual
          </h1>
          <p className="mt-2 text-gray-600">
            Vincule depósitos recebidos aos padrinhos para manter o histórico
            atualizado.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg bg-white p-6 shadow"
        >
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Buscar padrinho (nome ou e-mail)
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Ex.: Ana, ana@email.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Selecione o padrinho/madrinha *
              </label>
              <select
                value={formData.sponsorUuid}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    sponsorUuid: event.target.value,
                  }))
                }
                disabled={isLoadingSponsors}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
                required
              >
                <option value="">
                  {isLoadingSponsors
                    ? 'Carregando padrinhos...'
                    : 'Selecione um padrinho'}
                </option>
                {visibleSponsors.map((sponsor) => (
                  <option key={sponsor.uuid} value={sponsor.uuid}>
                    {sponsor.name} • {sponsor.email}
                  </option>
                ))}
              </select>
              {!isLoadingSponsors && visibleSponsors.length === 0 && (
                <p className="mt-2 text-sm text-red-500">
                  Nenhum padrinho encontrado para o termo pesquisado.
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
                placeholder="250,00"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
                required
              />
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
                placeholder="Detalhes do comprovante, banco, referência..."
                className="h-28 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/donations')}
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
