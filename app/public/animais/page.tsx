'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

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
      return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 4C16.34 4 15 5.34 15 7c0 .35.07.69.18 1H8.82c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3S3 5.34 3 7c0 1.3.84 2.4 2 2.82V18c0 1.1.9 2 2 2h2v3h2v-3h4v3h2v-3h2c1.1 0 2-.9 2-2V9.82c1.16-.42 2-1.52 2-2.82 0-1.66-1.34-3-3-3z" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 8L10.67 8.09C9.81 7.07 7.4 4.5 5 4.5C3.76 4.5 2.75 5.5 2.75 6.75c0 1.25 1.01 2.25 2.25 2.25.37 0 .72-.09 1.03-.24C6.85 9.92 8.5 11.5 9 13.06V18c0 2.21 1.79 4 4 4s4-1.79 4-4v-4.94c.5-1.56 2.15-3.14 2.97-4.3.31.15.66.24 1.03.24 1.24 0 2.25-1 2.25-2.25 0-1.25-1.01-2.25-2.25-2.25-2.4 0-4.81 2.57-5.67 3.59L12 8z" />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
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
        <Navbar />
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
      <Navbar />
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
                  <div
                    key={animal.uuid}
                    onClick={() =>
                      router.push(`/public/animais/${animal.slug}`)
                    }
                    className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                  >
                    {/* Imagem */}
                    <div className="relative h-64 overflow-hidden bg-gray-200">
                      {animal.photos && animal.photos.length > 0 ? (
                        <div className="w-full">
                          <Image
                            src={getFullImageUrl(animal.photos[0].photo_url)}
                            alt={animal.name}
                            className="h-full w-full object-cover"
                            width={0}
                            height={0}
                            sizes="100vh"
                            fill
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.src.includes('data:image')) {
                                target.onerror = null;
                                target.src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%236b7280" font-size="16"%3ESem imagem%3C/text%3E%3C/svg%3E';
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <svg
                            className="h-24 w-24 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Conteúdo */}
                    <div className="p-5">
                      <h3 className="mb-3 text-2xl font-bold text-gray-900">
                        {animal.name}
                      </h3>

                      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 rounded-full bg-[var(--ong-purple)] px-3 py-1 font-semibold text-white">
                          {getTypeIcon(animal.type)}
                          {getTypeLabel(animal.type)}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                          {animal.breed}
                        </span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-700">
                          {animal.age} {animal.age === 1 ? 'ano' : 'anos'}
                        </span>
                      </div>

                      <p className="mb-4 line-clamp-3 text-gray-600">
                        {animal.description}
                      </p>

                      {/* Tags */}
                      {animal.tags && animal.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {animal.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag.id}
                              className="rounded-full px-2.5 py-1 text-xs font-medium text-white"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.label}
                            </span>
                          ))}
                          {animal.tags.length > 3 && (
                            <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">
                              +{animal.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <button className="w-full rounded-lg bg-[var(--ong-orange)] px-4 py-2.5 font-semibold text-white transition-all hover:bg-[var(--ong-orange)]/90">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
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
