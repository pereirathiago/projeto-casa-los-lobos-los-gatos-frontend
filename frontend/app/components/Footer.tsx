interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={`py-8 text-white ${className}`}
      style={{ backgroundColor: '#8B5DDD' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <h3 className="mb-4 text-lg font-bold">
              Casa Los Lobos e Los Gatos
            </h3>
            <p className="text-sm text-purple-200">
              ONG dedicada ao resgate, cuidado e adoção de animais em situação
              de vulnerabilidade.
            </p>
          </div>

          {/* Contatos */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Contatos</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-sm text-purple-200">
                  (42) 9 9999-9999
                </span>
              </div>

              <div className="mt-4 flex space-x-4">
                <a
                  href="#"
                  className="text-purple-200 transition-colors hover:text-white"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348s1.051-2.348 2.348-2.348c1.297 0 2.348 1.051 2.348 2.348S9.746 16.988 8.449 16.988zM12.017 7.15c1.894 0 3.434 1.538 3.434 3.434s-1.54 3.434-3.434 3.434s-3.434-1.538-3.434-3.434S10.123 7.15 12.017 7.15z" />
                  </svg>
                </a>

                <a
                  href="#"
                  className="text-purple-200 transition-colors hover:text-white"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Direitos reservados */}
        <div className="mt-8 border-t border-purple-600 pt-6 text-center">
          <p className="text-sm text-purple-200">
            TODOS OS DIREITOS RESERVADOS
          </p>
        </div>
      </div>
    </footer>
  );
}
