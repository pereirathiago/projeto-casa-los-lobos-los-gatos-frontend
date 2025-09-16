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
  className = "" 
}: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow ${className}`}>
      {icon && (
        <div className="flex justify-center mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}