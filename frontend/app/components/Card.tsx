import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';

interface CardProps {
  title: string;
  description: string;
  icon: string | StaticImport;
  iconAlt?: string;
}

export default function Card({
  title,
  description,
  icon,
  iconAlt = 'Ícone',
}: CardProps) {
  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <Image src={icon} alt={iconAlt} width={80} height={80} />
      </div>
      <h3 className="mb-4 text-lg sm:text-xl font-bold text-black">{title}</h3>
      <p className="text-base sm:text-lg leading-relaxed text-black">{description}</p>

    </div>
  );
}
