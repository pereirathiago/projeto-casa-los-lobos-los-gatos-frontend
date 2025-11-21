export function getFullImageUrl(photoUrl: string | null | undefined): string {
  if (!photoUrl) {
    return '/placeholder-animal.jpg';
  }

  return photoUrl;
}
