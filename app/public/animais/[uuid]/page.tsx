'use client';

import Button from '@/app/components/Button';
import { authService } from '@/app/services/auth';
import { Cat, Dog } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '../../../components/Footer';
import PublicNavbar from '../../../components/PublicNavbar';

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

export default function AnimalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const uuid = params?.uuid as string;

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    // Verificar se o usuário está logado
    const currentUser = authService.getUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (uuid) {
      loadAnimal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  const handleWhatsAppSponsorship = (animalName: string) => {
    const phone = '5542988331566';
    const userName = user?.name || 'Interessado';
    const message = encodeURIComponent(
      `Olá! Vim pelo site da Casa Los Lobos e Los Gatos. Meu nome é ${userName} e gostaria de apadrinhar o(a) ${animalName}. Vi que o valor de apadrinhamento é R$ 20,00 por mês. Como posso proceder?`,
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const loadAnimal = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/public/animals/${uuid}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Animal não encontrado');
        }
        throw new Error('Erro ao carregar informações do animal');
      }

      const data = await response.json();
      setAnimal(data);
    } catch (error) {
      console.error('Erro ao carregar animal:', error);
      setError(
        error instanceof Error ? error.message : 'Erro ao carregar animal',
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
            <p className="text-xl text-gray-600">Carregando informações...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !animal) {
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
            <p className="mb-4 text-xl text-gray-800">
              {error || 'Animal não encontrado'}
            </p>
            <button
              onClick={() => router.push('/public/animais')}
              className="rounded-lg bg-[var(--ong-purple)] px-6 py-3 text-white transition-all hover:opacity-90"
            >
              Ver Todos os Animais
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const displayPhotos =
    animal.photos && animal.photos.length > 0 ? animal.photos.slice(0, 3) : [];

  return (
    <>
      <PublicNavbar />
      <main className="min-h-screen bg-gray-50 pt-20">
        {/* Breadcrumb */}
        <div className="pt-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/public/animais"
              className="inline-flex items-center text-sm text-[var(--ong-purple)] transition-colors hover:opacity-80"
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
              Voltar para todos os animais
            </Link>
          </div>
        </div>

        {/* Content */}
        <section className="pt-4 pb-12 sm:py-6 lg:pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Galeria de Fotos */}
              <div className="space-y-4">
                {/* Foto Principal */}
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200 shadow-xl">
                  {displayPhotos.length > 0 ? (
                    <div className="w-full">
                      <Image
                        src={getFullImageUrl(
                          displayPhotos[selectedPhotoIndex].photo_url,
                        )}
                        alt={`${animal.name} - Foto ${selectedPhotoIndex + 1}`}
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
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%236b7280" font-size="16"%3ESem imagem%3C/text%3E%3C/svg%3E';
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg
                        className="h-32 w-32 text-gray-400"
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

                {/* Miniaturas */}
                {displayPhotos.length > 1 && (
                  <div className="grid grid-cols-3 gap-4">
                    {displayPhotos.map((photo, index) => (
                      <button
                        key={photo.id}
                        onClick={() => setSelectedPhotoIndex(index)}
                        className={`relative aspect-square overflow-hidden rounded-lg transition-all ${
                          selectedPhotoIndex === index
                            ? 'ring-4 ring-[var(--ong-purple)]'
                            : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={getFullImageUrl(photo.photo_url)}
                          alt={`${animal.name} - Miniatura ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="flex flex-col justify-between gap-6">
                <div className="">
                  <div>
                    <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
                      {animal.name}
                    </h1>

                    <div className="mb-8 flex flex-wrap gap-3">
                      <span className="flex items-center gap-2 rounded-full bg-[var(--ong-purple)] px-4 py-2 text-lg font-semibold text-white">
                        {getTypeIcon(animal.type)}
                        {getTypeLabel(animal.type)}
                      </span>
                      <span className="rounded-full bg-gray-200 px-4 py-2 text-lg font-semibold text-gray-800">
                        {animal.breed}
                      </span>
                      <span className="rounded-full bg-gray-200 px-4 py-2 text-lg font-semibold text-gray-800">
                        {animal.age} {animal.age === 1 ? 'ano' : 'anos'}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {animal.tags && animal.tags.length > 0 && (
                    <div>
                      <h2 className="mb-3 text-lg font-semibold text-gray-900">
                        Características
                      </h2>
                      <div className="mb-8 flex flex-wrap gap-2">
                        {animal.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="rounded-full px-3 py-1.5 text-sm font-medium text-white"
                            style={{ backgroundColor: tag.color }}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Descrição */}
                  <div>
                    <h2 className="mb-3 text-lg font-semibold text-gray-900">
                      Sobre {animal.name}
                    </h2>
                    <p className="leading-relaxed whitespace-pre-line text-gray-700">
                      {animal.description}
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="rounded-2xl bg-gradient-to-br from-[var(--ong-purple)] to-purple-700 p-6 text-white shadow-lg">
                  <h3 className="mb-2 text-2xl font-bold">
                    Quer ajudar {animal.name}?
                  </h3>
                  <p className="mb-4 text-white/90">
                    Você pode se tornar padrinho ou madrinha e fazer a diferença
                    na vida deste animal!
                  </p>
                  {user && user.role === 'sponsor' ? (
                    <Button
                      onClick={() => handleWhatsAppSponsorship(animal.name)}
                      variant="tertiary"
                    >
                      Quero Apadrinhar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => router.push('/login')}
                      variant="tertiary"
                    >
                      Quero Apadrinhar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
