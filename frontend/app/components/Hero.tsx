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
  buttonHref = "#", 
  className = "",
  children 
}: HeroProps) {
  return (
    <section className={`py-20 text-white ${className}`} style={{ background: 'linear-gradient(45deg, #8B5DDD, #EA8C55)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {title}
          </h1>
          
          {subtitle && (
            <h2 className="text-xl md:text-3xl font-semibold mb-8" style={{ color: '#FFE4B5' }}>
              {subtitle}
            </h2>
          )}
          
          {description && (
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto" style={{ color: '#E6E6FA' }}>
              {description}
            </p>
          )}
          
          {buttonText && (
            <a
              href={buttonHref}
              className="inline-block font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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