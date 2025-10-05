import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Card from './components/Card';
import Footer from './components/Footer';
import Image from 'next/image';
import Animal_Shelter from './assets/icons/Animal_Shelter.svg';
import Medical_Doctor from './assets/icons/Medical_Doctor.svg';
import Heart_with_dog_paw from './assets/icons/Heart_with_dog_paw.svg';
import Cachorro2 from './assets/images/cachorro2-montado.png';
import Cachorro3 from './assets/images/cachorro3-montado.png';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        <Navbar />
        <Hero />
      </div>

      <section id="sobre" className="mt-50 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
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

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[320px] w-[460px]">
                <Image
                  src={Cachorro2}
                  alt="Cachorro resgatado"
                  fill
                  sizes="280px"
                  className="absolute right-10 -bottom-2 h-[400px] w-[280px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-atuamos" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center text-4xl font-bold text-black">
            COMO ATUAMOS?
          </h2>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
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
            <Card
              description="Conectar pessoas que querem ajudar com os animais que precisam."
              icon={Heart_with_dog_paw}
              title="CONEXÃO"
              iconAlt="Conexão com famílias"
            />
          </div>
        </div>
      </section>

      <section id="como-ajudar" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
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

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative h-[340px] w-[460px]">
                <Image
                  src={Cachorro3}
                  alt="Cachorro para apadrinhar"
                  width={300}
                  height={300}
                  className="absolute right-8 -bottom-1 -mb-10 h-auto w-[400px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
