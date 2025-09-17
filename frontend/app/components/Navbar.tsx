interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = '' }: NavbarProps) {
  return (
    <nav className={`fixed top-0 z-50 w-full bg-white shadow-sm ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center">
              <span className="mr-2 text-2xl">🐕</span>
              <h1 className="text-lg font-bold" style={{ color: '#000' }}>
                CASA
                <br />
                <span style={{ color: '#000' }}>Los Lobos</span>
                <br />
                <span style={{ color: '#000' }}>Los Gatos</span>
              </h1>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#sobre"
                className="text-sm font-medium text-black transition-colors hover:text-gray-600"
              >
                Sobre
              </a>
              <a
                href="#como-atuamos"
                className="text-sm font-medium text-black transition-colors hover:text-gray-600"
              >
                Como atuamos
              </a>
              <a
                href="#como-ajudar"
                className="text-sm font-medium text-black transition-colors hover:text-gray-600"
              >
                Como ajudar
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
