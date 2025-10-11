import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative max-h-[800px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/assets/images/background-cachorro1.png"
          alt=""
          priority
          fill
          sizes="100vw"
          className="origin-right scale-[1.15] object-contain object-right lg:scale-[1.25]"
        />
      </div>

      <div className="absolute inset-y-0 left-0 w-[40%] bg-white"></div>

      <div className="relative mx-auto max-w-none px-4 pt-28 pb-16 sm:px-6 lg:pr-0 lg:pl-8">
        <div className="grid min-h-[640px] grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_720px]">
          <div className="z-10 flex h-full flex-col items-start justify-center pl-5">
            <h1
              className="mb-4 text-5xl font-bold md:text-8xl"
              style={{ color: '#472B74' }}
            >
              Cuidar é amar.
            </h1>
            <h2
              className="mb-8 pl-3 text-2xl font-bold md:text-4xl"
              style={{ color: '#472B74' }}
            >
              Apadrinhe um amigo
            </h2>
          </div>

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
  );
}
