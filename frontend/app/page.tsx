import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SectionTitle from './components/SectionTitle';
import Card from './components/Card';
import Footer from './components/Footer';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative max-h-[800px] overflow-hidden">
          {/* Background shape (orange blob) on the right */}
          <div className="pointer-events-none absolute inset-0">
            <Image
              src="/assets/images/background-cachorro1.png"
              alt=""
              priority
              fill
              sizes="100vw"
              className="object-contain object-right origin-right scale-[1.15] lg:scale-[1.25]"
            />
          </div>

          {/* Solid white background behind the hero text (left side) */}
          <div className="absolute inset-y-0 left-0 w-[40%] bg-white"></div>

          <div className="relative mx-auto max-w-none px-4 pt-28 pb-16 sm:px-6 lg:pl-8 lg:pr-0">
            <div className="grid min-h-[640px] grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_720px]">
              {/* Left side - Text content */}
                <div className="z-10 flex flex-col items-start justify-center h-full pl-5">
                  <h1
                  className="mb-4 text-5xl font-bold md:text-8xl"
                  style={{ color: '#472B74' }}
                  >
                  Cuidar é amar.
                  </h1>
                  <h2
                  className="mb-8 text-2xl font-bold md:text-4xl pl-3"
                  style={{ color: '#472B74' }}
                  >
                  Apadrinhe um amigo
                  </h2>
                </div>

              {/* Right side - Dog image over the shape */}
              <div className="relative z-10 flex items-center justify-center lg:justify-end">
                <div className="relative ml-auto h-[580px] w-[580px] lg:h-[760px] lg:w-[760px]">
                  <Image
                    src="/assets/images/cachorro1.png"
                    alt="Cachorro para adoção"
                    fill
                    sizes="(min-width: 1024px) 760px, 580px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
      </section>

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

            {/* Right side - Dog 2 over purple blob */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[320px] w-[460px]">
                <Image
                  src="/assets/images/background-cachorro2.png"
                  alt=""
                  fill
                  sizes="440px"
                  className="object-contain"
                />
                <Image
                  src="/assets/images/cachorro2.png"
                  alt="Cachorro resgatado"
                  width={280}
                  height={280}
                  className="absolute -bottom-2 right-10 h-auto w-[280px] object-contain"
                />
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
                <Image
                  src="/assets/icons/Animal Shelter.svg"
                  alt="Resgate de animais"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">RESGATE</h3>
              <p className="text-sm leading-relaxed text-black">
                Resgatar animais abandonados ou em risco.
              </p>
            </div>

            {/* Card 2 - Cuidados */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/assets/icons/Medical Doctor.svg"
                  alt="Cuidados veterinários"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">CUIDADOS</h3>
              <p className="text-sm leading-relaxed text-black">
                Proporcionar cuidados médicos, alimentação e abrigo.
              </p>
            </div>

            {/* Card 3 - Conexão */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/assets/icons/Heart with dog paw.svg"
                  alt="Conexão com famílias"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="mb-4 text-xl font-bold text-black">CONEXÃO</h3>
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

            {/* Right side - Dog 3 over orange blob */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[340px] w-[460px]">
                <Image
                  src="/assets/images/background-cachorro3.png"
                  alt=""
                  fill
                  sizes="440px"
                  className="object-contain"
                />
                <Image
                  src="/assets/images/cachorro3.png"
                  alt="Cachorro para apadrinhar"
                  width={300}
                  height={300}
                  className="absolute -bottom-1 right-8 h-auto w-[300px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12 text-white"
        style={{ backgroundColor: '#472B74' }}
      >
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          {/* Contatos */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="/assets/icons/Instagram.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                />
                <span className="text-lg">@Instagram</span>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="/assets/icons/Facebook.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
                <span className="text-lg">@facebook</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image
                  src="/assets/icons/WhatsApp.svg"
                  alt="WhatsApp"
                  width={24}
                  height={24}
                />
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
