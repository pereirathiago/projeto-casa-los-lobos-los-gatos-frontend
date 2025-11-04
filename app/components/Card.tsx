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
      <div className="mb-4 flex justify-center sm:mb-5 md:mb-6">
        <Image
          src={icon}
          alt={iconAlt}
          width={64}
          height={64}
          className="h-16 w-16 sm:h-20 sm:w-20"
        />
      </div>
      <h3 className="mb-3 text-lg font-bold text-black sm:mb-4 sm:text-xl md:text-2xl">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-black sm:text-base md:text-lg">
        {description}
      </p>
    </div>
  );
}
