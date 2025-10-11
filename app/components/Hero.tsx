import Image from 'next/image';
import cachorroMontado from '../assets/images/cachorro1-montado.png';

export default function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="mx-auto max-w-none px-4 pt-28 pb-16 sm:px-6 lg:pr-0 lg:pl-8">
        <div className="flex min-h-[640px] items-center gap-12 lg:grid lg:grid-cols-[1fr_720px]">
          <div className="z-10 flex h-full flex-col items-start justify-center pl-75">
            <h1
              className="mb-8 text-[64px] leading-tight font-bold md:text-8xl"
              style={{ color: '#472B74', lineHeight: 1.15 }}
            >
              Cuidar é amar.
              <br />
              <span className="pl-1">Apadrinhe</span>
              <br />
              <span className="pl-1">um amigo.</span>
            </h1>
          </div>

          <div className="z-10 flex items-center justify-center lg:justify-end">
            <div className="absolute top-0 right-0 -z-10 h-[720px] w-[720px] lg:h-[920px] lg:w-[1080px]">
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
