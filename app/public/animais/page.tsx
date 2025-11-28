'use client';

import DogCard from '@/app/components/DogCard';
import { Cat, Dog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import PublicNavbar from '../../components/PublicNavbar';

interface AnimalPhoto {
  id: number;
  uuid: string;
  animal_id: number;
  photo_url: string;
  order_index: number;
  created_at: string;
}

interface AnimalTag {
  id: string;
  label: string;
  color: string;
}

interface Animal {
  id: number;
  uuid: string;
  slug: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number;
  description: string;
  photo_url: string | null;
  photos: AnimalPhoto[];
  tags: AnimalTag[];
  created_at: string;
  updated_at: string;
}

const getFullImageUrl = (photoUrl: string) => {
  if (!photoUrl) return '';
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
  return `${baseURL}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
};

export default function PublicAnimalsPage() {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnimals();
  }, []);

  const loadAnimals = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/public/animals');

      if (!response.ok) {
        throw new Error('Erro ao carregar animais');
      }

      const data = await response.json();
      setAnimals(data);
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      setError(
        'Não foi possível carregar os animais. Tente novamente mais tarde.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: 'dog' | 'cat') => {
    return type === 'dog' ? 'Cão' : 'Gato';
  };

  const getTypeIcon = (type: 'dog' | 'cat') => {
    if (type === 'dog') {
      return <Dog />;
    }
    return <Cat />;
  };

  if (isLoading) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-[var(--ong-purple)]"></div>
            <p className="text-xl text-gray-600">Carregando animais...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PublicNavbar />
        <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
          <div className="text-center">
            <svg
              className="mx-auto mb-4 h-16 w-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="mb-4 text-xl text-gray-800">{error}</p>
            <button
              onClick={loadAnimals}
              className="rounded-lg bg-[var(--ong-purple)] px-6 py-3 text-white transition-all hover:opacity-90"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Hero Section */}
        <section className="bg-gray-50 from-[var(--ong-orange)] to-[var(--ong-orange)]/80 pt-16 text-white">
          <div className="mx-automax-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold text-[var(--ong-purple)] sm:text-5xl md:text-6xl">
                Nossos Animais
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-[var(--ong-purple)] sm:text-xl md:text-2xl">
                Conheça os animais que estão disponíveis para apadrinhamento e
                adoção
              </p>
            </div>
          </div>
        </section>

        {/* Animals Grid */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {animals.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow-lg">
                <svg
                  className="mx-auto mb-4 h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xl font-semibold text-gray-700">
                  Nenhum animal disponível no momento
                </p>
                <p className="mt-2 text-gray-600">
                  Em breve teremos novos animais para você conhecer!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {animals.map((animal) => (
                  <DogCard
                    key={animal.uuid}
                    animal={animal}
                    onClick={() =>
                      router.push(`/public/animais/${animal.slug}`)
                    }
                    getFullImageUrl={getFullImageUrl}
                    getTypeIcon={getTypeIcon}
                    getTypeLabel={getTypeLabel}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
