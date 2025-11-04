import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors placeholder:text-gray-500 focus:ring-2 focus:outline-none sm:px-4 sm:py-3 sm:text-base ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-[var(--ong-purple)] focus:ring-[var(--ong-purple)]'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600 sm:text-sm">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
