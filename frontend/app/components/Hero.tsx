import { ReactNode } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  className?: string;
  children?: ReactNode;
}

export default function Hero({
  title,
  subtitle,
  description,
  buttonText,
  buttonHref = '#',
  className = '',
  children,
}: HeroProps) {
  return (
    <section
      className={`py-20 text-white ${className}`}
      style={{ background: 'linear-gradient(45deg, #8B5DDD, #EA8C55)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">{title}</h1>

          {subtitle && (
            <h2
              className="mb-8 text-xl font-semibold md:text-3xl"
              style={{ color: '#FFE4B5' }}
            >
              {subtitle}
            </h2>
          )}

          {description && (
            <p
              className="mx-auto mb-8 max-w-3xl text-lg md:text-xl"
              style={{ color: '#E6E6FA' }}
            >
              {description}
            </p>
          )}

          {buttonText && (
            <a
              href={buttonHref}
              className="inline-block transform rounded-lg px-8 py-4 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ backgroundColor: '#EA8C55', color: 'white' }}
            >
              {buttonText}
            </a>
          )}

          {children}
        </div>
      </div>
    </section>
  );
}
