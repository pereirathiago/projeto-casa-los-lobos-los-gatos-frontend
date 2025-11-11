'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Animal, apiService } from '../services/api';
import { authService } from '../services/auth';
import Alert from './Alert';
import Button from './Button';
import Input from './Input';

interface Tag {
  id: string;
  label: string;
  color: string;
}

interface AnimalFormData {
  name: string;
  type: 'dog' | 'cat' | '';
  breed: string;
  age: string;
  description: string;
  photos: (File | null)[];
  tags: Tag[];
}

interface AnimalFormProps {
  animal?: Animal;
}

const TAG_COLORS = [
  { name: 'Roxo', value: '#6645a0' },
  { name: 'Laranja', value: '#cd6b16' },
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Rosa', value: '#ec4899' },
  { name: 'Amarelo', value: '#f59e0b' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Cinza', value: '#6b7280' },
];

export default function AnimalForm({ animal }: AnimalFormProps) {
  const router = useRouter();
  const isEditing = !!animal;

  const [formData, setFormData] = useState<AnimalFormData>({
    name: '',
    type: '',
    breed: '',
    age: '',
    description: '',
    photos: [null, null, null],
    tags: [],
  });

  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);

  // Carregar dados do animal se estiver editando
  useEffect(() => {
    if (animal) {
      setFormData({
        name: animal.name,
        type: animal.type,
        breed: animal.breed,
        age: animal.age.toString(),
        description: animal.description,
        photos: [null, null, null],
        tags: animal.tags || [],
      });

      // Carregar fotos existentes
      if (animal.photos && animal.photos.length > 0) {
        const photoUrls = animal.photos
          .sort((a, b) => a.order_index - b.order_index)
          .map(
            (photo) =>
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${photo.photo_url}`,
          );
        setExistingPhotos(photoUrls);
      }
    }
  }, [animal]);

  const [newTag, setNewTag] = useState({
    label: '',
    color: TAG_COLORS[0].value,
  });

  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          [`photo${index}`]: 'Por favor, selecione uma imagem válida',
        }));
        return;
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [`photo${index}`]: 'A imagem deve ter no máximo 5MB',
        }));
        return;
      }

      // Atualizar array de fotos
      const newPhotos = [...formData.photos];
      newPhotos[index] = file;
      setFormData((prev) => ({ ...prev, photos: newPhotos }));
      setErrors((prev) => ({ ...prev, [`photo${index}`]: '' }));

      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...photoPreviews];
        newPreviews[index] = reader.result as string;
        setPhotoPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = [...formData.photos];
    newPhotos[index] = null;
    setFormData((prev) => ({ ...prev, photos: newPhotos }));

    const newPreviews = [...photoPreviews];
    newPreviews[index] = null;
    setPhotoPreviews(newPreviews);

    // Resetar input
    const input = document.getElementById(`photo-${index}`) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handleAddTag = () => {
    if (!newTag.label.trim()) {
      return;
    }

    // Gerar ID único usando timestamp + random para evitar conflitos
    const uniqueId = `tag-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const tag: Tag = {
      id: uniqueId,
      label: newTag.label.trim(),
      color: newTag.color,
    };

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));

    setNewTag({
      label: '',
      color: TAG_COLORS[0].value,
    });
  };

  const handleRemoveTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== tagId),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.type) {
      newErrors.type = 'Tipo de animal é obrigatório';
    }

    if (!formData.breed.trim()) {
      newErrors.breed = 'Raça é obrigatória';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Idade é obrigatória';
    } else {
      const ageNum = parseFloat(formData.age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 30) {
        newErrors.age = 'Idade deve ser um número entre 0 e 30';
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Descrição deve ter pelo menos 20 caracteres';
    }

    // Validar se pelo menos uma foto foi adicionada (apenas na criação)
    if (!isEditing) {
      const hasPhoto = formData.photos.some((photo) => photo !== null);
      if (!hasPhoto) {
        newErrors.photos = 'Adicione pelo menos uma foto do animal';
      }
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

    setIsLoading(true);

    try {
      const token = authService.getToken();
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      // Criar FormData para enviar arquivo
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('breed', formData.breed);
      formDataToSend.append('age', formData.age);
      formDataToSend.append('description', formData.description);

      // Adicionar fotos novas se houver (na edição, fotos são opcionais)
      const hasNewPhotos = formData.photos.some((photo) => photo !== null);
      const photosToSend = formData.photos.filter((photo) => photo !== null);

      console.log('📸 Fotos a serem enviadas:', photosToSend.length);

      if (hasNewPhotos || !isEditing) {
        formData.photos.forEach((photo) => {
          if (photo) {
            console.log(
              '📤 Adicionando foto:',
              photo.name,
              'Size:',
              photo.size,
              'Type:',
              photo.type,
            );
            formDataToSend.append('photos', photo);
          }
        });
      }

      formDataToSend.append('tags', JSON.stringify(formData.tags));

      console.log('📋 FormData pronto para envio:', {
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        age: formData.age,
        photosCount: photosToSend.length,
        tagsCount: formData.tags.length,
      });

      if (isEditing && animal) {
        // Atualizar animal existente
        console.log('🔄 Atualizando animal:', animal.uuid);
        const response = await apiService.updateAnimal(
          token,
          animal.uuid,
          formDataToSend,
        );
        console.log('✅ Animal atualizado:', response);
        setAlert({
          type: 'success',
          message: 'Animal atualizado com sucesso!',
        });
      } else {
        // Criar novo animal
        console.log('➕ Criando novo animal...');
        const response = await apiService.createAnimal(token, formDataToSend);
        console.log('✅ Animal criado:', response);
        setAlert({
          type: 'success',
          message: 'Animal cadastrado com sucesso!',
        });
      }

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/animals');
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} animal. Tente novamente.`;
      setAlert({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
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

      {/* Nome */}
      <Input
        label="Nome do Animal *"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Ex: Rex, Mia, Bolinha..."
        error={errors.name}
      />

      {/* Tipo de Animal */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tipo de Animal *
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none sm:px-4 sm:py-3 sm:text-base ${
            errors.type
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[var(--ong-purple)] focus:ring-[var(--ong-purple)]'
          }`}
        >
          <option value="">Selecione o tipo</option>
          <option value="dog">🐕 Cachorro</option>
          <option value="cat">🐈 Gato</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-xs text-red-600 sm:text-sm">{errors.type}</p>
        )}
      </div>

      {/* Raça e Idade - Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Raça *"
          name="breed"
          value={formData.breed}
          onChange={handleInputChange}
          placeholder="Ex: Labrador, Siamês, SRD..."
          error={errors.breed}
        />

        <Input
          label="Idade (anos) *"
          name="age"
          type="number"
          step="0.5"
          min="0"
          max="30"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="Ex: 2, 3.5, 0.5..."
          error={errors.age}
        />
      </div>

      {/* Fotos - Carrossel de 3 imagens */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Fotos do Animal {!isEditing && '* '}(até 3 fotos)
        </label>
        <p className="mb-3 text-xs text-gray-500 sm:text-sm">
          {isEditing
            ? 'Adicione novas fotos para substituir as atuais (opcional). Se não adicionar, as fotos atuais serão mantidas.'
            : 'Adicione até 3 fotos para mostrar o animal de diferentes ângulos'}
        </p>

        {/* Fotos existentes (apenas na edição) */}
        {isEditing && existingPhotos.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Fotos atuais:
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {existingPhotos.map((photoUrl, index) => (
                <div
                  key={index}
                  className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-gray-300"
                >
                  <Image
                    src={photoUrl}
                    alt={`Foto atual ${index + 1}`}
                    fill
                    className="bg-gray-100 object-contain"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-animal.jpg';
                    }}
                  />
                  <div className="absolute right-0 bottom-0 left-0 bg-black/60 px-2 py-1 text-center text-xs text-white">
                    Foto atual {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grid de 3 cards de upload */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex flex-col">
              <div className="relative">
                {photoPreviews[index] ? (
                  <div className="group relative">
                    <div className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-[var(--ong-purple)]">
                      <Image
                        src={photoPreviews[index]!}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="bg-gray-100 object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                    >
                      ✕
                    </button>
                    <div className="mt-2 text-center text-xs font-medium text-[var(--ong-purple)]">
                      {isEditing ? 'Nova foto' : 'Foto'} {index + 1}
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor={`photo-${index}`}
                    className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[var(--ong-purple)] hover:bg-purple-50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="mb-3 h-10 w-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="mb-2 text-xs text-gray-500 sm:text-sm">
                        <span className="font-semibold">
                          {isEditing ? 'Nova foto' : 'Foto'} {index + 1}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (max 5MB)
                      </p>
                    </div>
                    <input
                      id={`photo-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, index)}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>

        {errors.photos && (
          <p className="mt-2 text-xs text-red-600 sm:text-sm">
            {errors.photos}
          </p>
        )}
      </div>
      {/* Descrição */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Descrição *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={5}
          placeholder="Conte sobre a personalidade, história e características do animal..."
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-500 focus:ring-2 focus:outline-none sm:px-4 sm:py-3 sm:text-base ${
            errors.description
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[var(--ong-purple)] focus:ring-[var(--ong-purple)]'
          }`}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.description && (
            <p className="text-xs text-red-600 sm:text-sm">
              {errors.description}
            </p>
          )}
          <p className="ml-auto text-xs text-gray-500 sm:text-sm">
            {formData.description.length} caracteres
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Tags de Personalidade
        </label>
        <p className="mb-3 text-xs text-gray-500 sm:text-sm">
          Adicione características que descrevem o animal (ex: Saudável,
          Brincalhão, Tímido, Dorminhoco)
        </p>

        {/* Adicionar nova tag */}
        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row">
          <input
            type="text"
            value={newTag.label}
            onChange={(e) =>
              setNewTag((prev) => ({ ...prev, label: e.target.value }))
            }
            placeholder="Nome da tag"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none sm:text-base"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <select
            value={newTag.color}
            onChange={(e) =>
              setNewTag((prev) => ({ ...prev, color: e.target.value }))
            }
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[var(--ong-purple)] focus:ring-2 focus:ring-[var(--ong-purple)] focus:outline-none sm:text-base"
          >
            {TAG_COLORS.map((color) => (
              <option key={color.value} value={color.value}>
                {color.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            onClick={handleAddTag}
            variant="secondary"
            className="whitespace-nowrap"
          >
            + Adicionar
          </Button>
        </div>

        {/* Lista de tags adicionadas */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm sm:text-base"
                style={{ backgroundColor: tag.color }}
              >
                <span>{tag.label}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag.id)}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-white transition-colors hover:bg-white/50"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(isEditing ? '/animals' : '/dashboard')}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} disabled={isLoading}>
          {isEditing ? 'Atualizar Animal' : 'Cadastrar Animal'}
        </Button>
      </div>
    </form>
  );
}
