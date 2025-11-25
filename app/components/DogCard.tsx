import Image from 'next/image';
import type { Animal } from '../services/api';
import Button from './Button';

interface DogCardProps {
  animal: Animal;
  onClick: () => void;
  getFullImageUrl: (url: string) => string;
  getTypeIcon: (type: 'dog' | 'cat') => React.ReactNode;
  getTypeLabel: (type: 'dog' | 'cat') => string;
  isAdminMode?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function DogCard({
  animal,
  onClick,
  getFullImageUrl,
  getTypeIcon,
  getTypeLabel,
  isAdminMode = false,
  onEdit,
  onDelete,
}: DogCardProps) {
  return (
    <div
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Imagem */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        {animal.photos &&
        animal.photos.length > 0 &&
        animal.photos[0].photo_url ? (
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
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 text-2xl font-bold text-gray-900">{animal.name}</h3>

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

        <p className="mb-4 line-clamp-3 text-gray-600">{animal.description}</p>

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

        {isAdminMode ? (
          <div className="mt-auto flex gap-2">
            <Button
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="flex-[2] !px-4 !py-2.5"
            >
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="flex-1 !border-red-600 !px-4 !py-2.5 !text-red-600"
            >
              Excluir
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            onClick={onClick}
            className="mt-auto w-full !px-4 !py-2.5"
          >
            Ver Detalhes
          </Button>
        )}
      </div>
    </div>
  );
}

export default DogCard;
