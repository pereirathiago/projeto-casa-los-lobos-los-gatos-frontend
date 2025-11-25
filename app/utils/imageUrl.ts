const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export function getFullImageUrl(photoUrl: string | null | undefined): string {
  if (!photoUrl) {
    return '/placeholder-animal.jpg';
  }

  // Se já é uma URL completa, retorna como está
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    return photoUrl;
  }

  // Se já começa com barra, adiciona apenas a base URL
  if (photoUrl.startsWith('/')) {
    return `${API_BASE_URL}${photoUrl}`;
  }

  // Se é apenas o nome do arquivo, adiciona o caminho /animals/
  return `${API_BASE_URL}/animals/${photoUrl}`;
}
