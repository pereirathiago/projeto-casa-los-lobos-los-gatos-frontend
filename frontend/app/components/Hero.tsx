import Image from 'next/image';
import cachorroMontado from '../assets/images/cachorro1-montado.png';
import background from '../assets/images/background-cachorro1.png';

export default function Hero() {
  return (
    <section className="overflow-hidden">

      <div className=" mx-auto max-w-none px-4 pt-28 pb-16 sm:px-6 lg:pr-0 lg:pl-8">
        <div className="flex min-h-[640px] items-center gap-12 lg:grid lg:grid-cols-[1fr_720px]">
          <div className="z-10 flex h-full flex-col items-start justify-center pl-75">
            <h1
              className="mb-4 text-[64px] font-bold md:text-8xl"
              style={{ color: '#472B74' }}
            >
              Cuidar é amar.
            </h1>
            <h1
              className="mb-8 pl-3 text-[64px] font-bold md:text-8xl"
              style={{ color: '#472B74' }}
            >
              Apadrinhe
            </h1>
            
            <h1
              className="mb-8 pl-3 text-[64px] font-bold md:text-8xl"
              style={{ color: '#472B74' }}
            >
              um amigo.
            </h1>
          </div>

          <div className="z-10 flex items-center justify-center lg:justify-end">
            <div className="absolute right-0 top-0 -z-10 h-[720px] w-[720px] lg:h-[920px] lg:w-[1080px]">
              <Image
                src={cachorroMontado}
                alt="Cachorro para adoção"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
