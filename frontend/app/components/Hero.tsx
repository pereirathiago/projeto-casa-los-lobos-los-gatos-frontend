import Image from 'next/image';
import cachorroMontado from '../assets/images/cachorro1-montado.png';

export default function Hero() {
  return (
    <section className="relative flex min-h-[120vh] items-center bg-white max-[1120px]:min-h-screen max-[1000px]:min-h-[78vh] max-[795px]:-mb-60 max-[795px]:min-h-[90vh] max-[615px]:mb-20">
      <div className="absolute top-0 right-0 h-full w-full origin-top-right scale-62 max-[615px]:scale-100 max-[615px]:opacity-100 min-[795px]:h-[104vh] min-[795px]:scale-72 min-[1000px]:h-[138vh] min-[1000px]:w-[100vw] min-[1000px]:scale-65 min-[1120px]:h-full min-[1120px]:w-4/6 min-[1120px]:scale-90 min-[1120px]:bg-transparent md:opacity-100">
        <Image
          src={cachorroMontado}
          alt="Cachorro para adoção"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 max-[1000px]:-translate-y-9 max-[795px]:-translate-y-35 max-[615px]:absolute max-[615px]:top-1/2 max-[615px]:left-1/2 max-[615px]:-translate-x-1/2 max-[615px]:-translate-y-1/2 sm:px-6 lg:px-8">
        <div className="max-w-xl text-left max-[615px]:mx-auto max-[615px]:text-center">
          <h1
            className="text-4xl leading-tight font-bold text-[#472B74] max-[615px]:w-[100vw] max-[615px]:bg-[#FFFFFF80] max-[615px]:text-6xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
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
