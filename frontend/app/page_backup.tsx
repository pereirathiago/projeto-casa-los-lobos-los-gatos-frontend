import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SectionTitle from './components/SectionTitle';
import Card from './components/Card';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-16">
        {' '}
        {/* Offset for fixed navbar */}
        <section className="relative overflow-hidden">
          {/* Background shapes */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 h-full w-1/2 bg-gray-50"></div>
            <div
              className="absolute top-0 right-0 h-full w-1/2"
              style={{ backgroundColor: '#EA8C55' }}
            >
              <div
                className="absolute inset-0 origin-top-left skew-x-12 transform"
                style={{ backgroundColor: '#EA8C55' }}
              ></div>
            </div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid min-h-[500px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
              {/* Left side - Text content */}
              <div className="z-10">
                <h1
                  className="mb-4 text-5xl font-bold md:text-7xl"
                  style={{ color: '#8B5DDD' }}
                >
                  Cuidar é amar.
                </h1>
                <h2
                  className="mb-8 text-2xl font-bold md:text-4xl"
                  style={{ color: '#8B5DDD' }}
                >
                  Apadrinhe um amigo
                </h2>
              </div>

              {/* Right side - Dog image */}
              <div className="relative z-10 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="h-80 w-80 overflow-hidden rounded-full lg:h-96 lg:w-96">
                    <div
                      className="flex h-full w-full items-center justify-center text-8xl"
                      style={{ backgroundColor: '#EA8C55' }}
                    >
                      🐕
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Seção Quem Somos */}
      <section id="sobre" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left side - Text content */}
            <div>
              <h2 className="mb-8 text-4xl font-bold text-black">
                QUEM SOMOS?
              </h2>
              <p className="text-lg leading-relaxed text-black">
                Somos uma ONG dedicada a resgatar, cuidar e dar uma nova chance
                a cães e gatos em situação de vulnerabilidade. Nosso trabalho
                vai além do resgate: garantimos cuidados veterinários,
                alimentação, carinho e buscamos famílias amorosas para cada um
                dos nossos animais.
              </p>
            </div>

            {/* Right side - Dog with lion costume */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <div
                  className="h-80 w-80 overflow-hidden rounded-full"
                  style={{ backgroundColor: '#8B5DDD' }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-64 w-64 items-center justify-center overflow-hidden rounded-full bg-white">
                      <span className="text-6xl">🦁</span>{' '}
                      {/* Dog with lion costume */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Como Atuamos */}
      <section id="como-atuamos" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center text-4xl font-bold text-black">
            COMO ATUAMOS?
          </h2>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Card 1 - Resgate */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#E8D5F2' }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-lg"
                    style={{ backgroundColor: '#8B5DDD' }}
                  >
                    <span className="text-2xl text-white">🏠</span>
                  </div>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">RESGATE</h3>
              <p className="text-sm leading-relaxed text-black">
                Resgatar animais abandonados ou em risco.
              </p>
            </div>

            {/* Card 2 - Cuidados */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#E8D5F2' }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-lg"
                    style={{ backgroundColor: '#8B5DDD' }}
                  >
                    <span className="text-2xl text-white">👨‍⚕️</span>
                  </div>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">RESGATE</h3>
              <p className="text-sm leading-relaxed text-black">
                Proporcionar cuidados médicos, alimentação e abrigo.
              </p>
            </div>

            {/* Card 3 - Conexão */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full"
                  style={{ backgroundColor: '#E8D5F2' }}
                >
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-lg"
                    style={{ backgroundColor: '#8B5DDD' }}
                  >
                    <span className="text-2xl text-white">💜</span>
                  </div>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">RESGATE</h3>
              <p className="text-sm leading-relaxed text-black">
                Conectar pessoas que querem ajudar com os animais que precisam.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Como Ajudar */}
      <section id="como-ajudar" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Left side - Text content */}
            <div>
              <h2 className="mb-8 text-4xl font-bold text-black">
                COMO AJUDAR?
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-black">
                Você pode ser dindo ou dinda de um dos nossos animais!
              </p>
              <p className="mb-6 text-lg leading-relaxed text-black">
                Funciona assim:
              </p>

              <ul className="mb-6 space-y-4 text-lg text-black">
                <li className="flex items-start">
                  <span className="mr-2 text-lg">•</span>
                  Escolha um animal disponível para apadrinhar.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">•</span>
                  Contribua mensalmente com ração, medicamentos ou qualquer
                  valor a partir de R$20,00.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-lg">•</span>
                  Todo mês, você recebe uma foto e novidades sobre o seu
                  afilhado.
                </li>
              </ul>

              <p className="text-lg leading-relaxed text-black">
                É uma forma linda de fazer parte da vida deles, mesmo que não
                possa adotar.
              </p>
            </div>

            {/* Right side - Poodle image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <div
                  className="h-80 w-80 overflow-hidden rounded-full"
                  style={{ backgroundColor: '#EA8C55' }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-6xl">�</span> {/* Poodle */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 text-white"
        style={{ backgroundColor: '#8B5DDD' }}
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {/* Contatos */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📞</span>
                <span className="text-lg">@Instagram</span>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📘</span>
                <span className="text-lg">@facebook</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📱</span>
                <span className="text-lg">(42) 9 9999-9999</span>
              </div>
            </div>
          </div>

          {/* Direitos reservados */}
          <div className="border-t border-purple-400 pt-6">
            <p className="text-sm">TODOS OS DIREITOS RESERVADOS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
