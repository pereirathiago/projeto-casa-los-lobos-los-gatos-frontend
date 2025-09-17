import { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: ReactNode;
}

export default function SectionTitle({
  title,
  subtitle,
  className = '',
  children,
}: SectionTitleProps) {
  return (
    <div className={`mb-12 text-center ${className}`}>
      <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>
      )}

      {children}
    </div>
  );
}
