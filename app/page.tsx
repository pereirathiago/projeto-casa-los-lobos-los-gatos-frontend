import Image from 'next/image';
import Link from 'next/link';
import Animal_Shelter from './assets/icons/Animal_Shelter.svg';
import Heart_with_dog_paw from './assets/icons/Heart_with_dog_paw.svg';
import Medical_Doctor from './assets/icons/Medical_Doctor.svg';
import Cachorro2 from './assets/images/cachorro2-montado.png';
import Cachorro3 from './assets/images/cachorro3-montado.png';
import Card from './components/Card';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      <section
        id="sobre"
        className="relative bg-white py-12 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative order-2 flex justify-center lg:order-1">
              <div className="relative h-[220px] w-full max-w-md sm:h-[280px] md:h-[340px] lg:h-[380px]">
                <Image
                  src={Cachorro2}
                  alt="Cachorro resgatado"
                  fill
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="relative z-10 order-1 text-center lg:order-2">
              <h2 className="mb-4 text-2xl font-bold text-black sm:mb-5 sm:text-3xl md:mb-6 md:text-4xl lg:text-5xl">
                QUEM SOMOS?
              </h2>

              <p className="text-base leading-relaxed text-black sm:text-lg md:text-xl">
                Somos uma ONG dedicada a resgatar, cuidar e dar uma nova chance
                a cães e gatos em situação de vulnerabilidade. Nosso trabalho
                vai além do resgate: garantimos cuidados veterinários,
                alimentação, carinho e buscamos famílias amorosas para cada um
                dos nossos animais.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-atuamos"
        className="bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-black sm:mb-10 sm:text-3xl md:mb-12 md:text-4xl lg:mb-16">
            COMO ATUAMOS?
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:gap-10 lg:grid-cols-3 lg:gap-12">
            <Card
              description="Resgatar animais abandonados ou em risco."
              icon={Animal_Shelter}
              title="RESGATE"
              iconAlt="Resgate de animais"
            />
            <Card
              description="Proporcionar cuidados médicos, alimentação e abrigo."
              icon={Medical_Doctor}
              title="CUIDADOS"
              iconAlt="Cuidados veterinários"
            />
            <div className="sm:col-span-2 lg:col-span-1">
              <Card
                description="Conectar pessoas que querem ajudar com os animais que precisam."
                icon={Heart_with_dog_paw}
                title="CONEXÃO"
                iconAlt="Conexão com famílias"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="como-ajudar"
        className="bg-white py-12 sm:py-16 md:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative flex justify-center">
              <div className="relative h-[240px] w-full max-w-md sm:h-[280px] md:h-[340px] lg:h-[380px]">
                <Image
                  src={Cachorro3}
                  alt="Cachorro para apadrinhar"
                  fill
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="object-contain"
                />
              </div>
            </div>

            <div className="text-center">
              <h2 className="mb-4 text-center text-2xl font-bold text-black sm:mb-5 sm:text-3xl md:mb-6 md:text-4xl lg:text-left">
                COMO AJUDAR?
              </h2>
              <p className="mb-4 text-center text-base leading-relaxed text-black sm:mb-5 sm:text-lg md:mb-6 md:text-xl lg:text-left">
                Você pode ser dindo ou dinda de um dos nossos animais! Funciona
                assim:
              </p>

              <ul className="mx-auto mb-4 max-w-2xl space-y-3 pl-4 text-left text-base text-black sm:mb-5 sm:space-y-3.5 sm:pl-6 sm:text-lg md:mb-6 md:text-xl lg:max-w-none lg:pl-7">
                <li className="flex items-start">
                  <span className="mt-1.5 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--ong-purple)]"></span>
                  <span>Escolha um animal disponível para apadrinhar.</span>
                </li>
                <li className="flex items-start">
                  <span className="mt-1.5 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--ong-purple)]"></span>
                  <span>
                    Contribua mensalmente com ração, medicamentos ou qualquer
                    valor a partir de R$20,00.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mt-1.5 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--ong-purple)]"></span>
                  <span>
                    Todo mês, você recebe uma foto e novidades sobre o seu
                    afilhado.
                  </span>
                </li>
              </ul>

              <p className="text-center text-base leading-relaxed text-black sm:text-lg md:text-xl lg:text-left">
                É uma forma linda de fazer parte da vida deles, mesmo que não
                possa adotar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--ong-purple)] to-[var(--ong-orange)] p-8 shadow-2xl sm:p-12 md:p-16">
            <div className="text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:text-6xl">
                Conheça Nossos Animais
              </h2>
              <p className="mb-6 text-base leading-relaxed text-white/95 sm:mb-8 sm:text-lg md:mb-10 md:text-xl">
                Veja todos os cães e gatos que estão esperando por uma família
                ou um padrinho/madrinha. Cada um deles tem uma história única e
                muito amor para dar.
              </p>
              <Link
                href="/public/animais"
                className="inline-block rounded-lg bg-white px-8 py-3 text-lg font-bold text-[var(--ong-orange)] shadow-xl transition-all hover:scale-105 hover:shadow-2xl sm:px-10 sm:py-4 sm:text-xl md:text-2xl"
              >
                Ver Animais Disponíveis
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
