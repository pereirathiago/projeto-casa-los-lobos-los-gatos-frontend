import Image from 'next/image';
import cachorroMontado from '../assets/images/cachorro1-montado.png';
import cachorroMobile from '../assets/images/cachorro1-mobile.png';

export default function Hero() {
  return (
    <section className="relative flex min-h-[120vh] items-center bg-white max-[1120px]:min-h-screen max-[1000px]:min-h-[78vh] max-[795px]:-mb-60 max-[795px]:min-h-[90vh] max-[615px]:mt-12 max-[615px]:mb-20">
      <div className="absolute top-20 right-0 h-full w-full origin-top-right scale-62 max-[615px]:scale-100 min-[795px]:h-[104vh] min-[795px]:scale-72 min-[1000px]:h-[138vh] min-[1000px]:w-[100vw] min-[1000px]:scale-65 min-[1120px]:h-full min-[1120px]:w-4/6 min-[1120px]:scale-90 min-[1120px]:bg-transparent md:opacity-100">
        {/* Imagem Desktop - oculta em telas < 640px */}
        <Image
          src={cachorroMontado}
          alt="Cachorro para adoção"
          fill
          className="object-cover object-top max-[640px]:hidden"
          priority
        />
        {/* Imagem Mobile - visível apenas em telas < 640px */}
        <Image
          src={cachorroMobile}
          alt="Cachorro para adoção"
          fill
          className="object-fill object-top min-[640px]:hidden"
          priority
        />
      </div>

      <div className="relative bottom-0 z-10 mx-auto w-full max-w-7xl px-4 max-[1000px]:-translate-y-9 max-[795px]:-translate-y-35 max-[615px]:-translate-y-60 sm:px-6 lg:px-8">
        <div className="max-w-xl text-left">
          <h1
            className="text-4xl leading-tight font-bold text-[#472B74] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            style={{ lineHeight: 1.15 }}
          >
            Cuidar é amar.
            <br />
            <span>Apadrinhe</span>
            <br />
            <span>um amigo.</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
