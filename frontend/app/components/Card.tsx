import { ReactNode } from 'react';

interface CardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export default function Card({
  title,
  description,
  icon,
  className = '',
}: CardProps) {
  return (
    <div
      className={`rounded-lg bg-white p-6 text-center shadow-lg transition-shadow hover:shadow-xl ${className}`}
    >
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}

      <h3 className="mb-3 text-xl font-bold text-gray-800">{title}</h3>

      <p className="leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
