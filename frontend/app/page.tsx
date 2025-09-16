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
      <div className="pt-16"> {/* Offset for fixed navbar */}
        <section className="relative overflow-hidden">
          {/* Background shapes */}
          <div className="absolute inset-0">
            <div className="absolute left-0 top-0 w-1/2 h-full bg-gray-50"></div>
            <div className="absolute right-0 top-0 w-1/2 h-full" style={{ backgroundColor: '#EA8C55' }}>
              <div className="absolute inset-0 transform skew-x-12 origin-top-left" style={{ backgroundColor: '#EA8C55' }}></div>
            </div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
              {/* Left side - Text content */}
              <div className="z-10">
                <h1 className="text-5xl md:text-7xl font-bold mb-4" style={{ color: '#8B5DDD' }}>
                  Cuidar é amar.
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold mb-8" style={{ color: '#8B5DDD' }}>
                  Apadrinhe um amigo
                </h2>
              </div>
              
              {/* Right side - Dog image */}
              <div className="relative z-10 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-8xl" style={{ backgroundColor: '#EA8C55' }}>
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
      <section id="sobre" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div>
              <h2 className="text-4xl font-bold text-black mb-8">QUEM SOMOS?</h2>
              <p className="text-lg text-black leading-relaxed">
                Somos uma ONG dedicada a resgatar, cuidar e dar uma nova chance a cães e gatos em 
                situação de vulnerabilidade. Nosso trabalho vai além do resgate: garantimos cuidados 
                veterinários, alimentação, carinho e buscamos famílias amorosas para cada um dos nossos 
                animais.
              </p>
            </div>
            
            {/* Right side - Dog with lion costume */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden" style={{ backgroundColor: '#8B5DDD' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-64 h-64 rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <span className="text-6xl">🦁</span> {/* Dog with lion costume */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção Como Atuamos */}
      <section id="como-atuamos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-black text-center mb-16">COMO ATUAMOS?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Card 1 - Resgate */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8D5F2' }}>
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B5DDD' }}>
                    <span className="text-white text-2xl">🏠</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">RESGATE</h3>
              <p className="text-black text-sm leading-relaxed">
                Resgatar animais abandonados ou em risco.
              </p>
            </div>
            
            {/* Card 2 - Cuidados */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8D5F2' }}>
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B5DDD' }}>
                    <span className="text-white text-2xl">👨‍⚕️</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">RESGATE</h3>
              <p className="text-black text-sm leading-relaxed">
                Proporcionar cuidados médicos, alimentação e abrigo.
              </p>
            </div>
            
            {/* Card 3 - Conexão */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E8D5F2' }}>
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#8B5DDD' }}>
                    <span className="text-white text-2xl">💜</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-black mb-4">RESGATE</h3>
              <p className="text-black text-sm leading-relaxed">
                Conectar pessoas que querem ajudar com os animais que precisam.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Seção Como Ajudar */}
      <section id="como-ajudar" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div>
              <h2 className="text-4xl font-bold text-black mb-8">COMO AJUDAR?</h2>
              <p className="text-lg text-black leading-relaxed mb-6">
                Você pode ser dindo ou dinda de um dos nossos animais!
              </p>
              <p className="text-lg text-black leading-relaxed mb-6">
                Funciona assim:
              </p>
              
              <ul className="space-y-4 text-lg text-black mb-6">
                <li className="flex items-start">
                  <span className="text-lg mr-2">•</span>
                  Escolha um animal disponível para apadrinhar.
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">•</span>
                  Contribua mensalmente com ração, medicamentos ou qualquer valor a partir de R$20,00.
                </li>
                <li className="flex items-start">
                  <span className="text-lg mr-2">•</span>
                  Todo mês, você recebe uma foto e novidades sobre o seu afilhado.
                </li>
              </ul>
              
              <p className="text-lg text-black leading-relaxed">
                É uma forma linda de fazer parte da vida deles, mesmo que não possa adotar.
              </p>
            </div>
            
            {/* Right side - Poodle image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden" style={{ backgroundColor: '#EA8C55' }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl">�</span> {/* Poodle */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="text-white py-12" style={{ backgroundColor: '#8B5DDD' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Contatos */}
          <div className="mb-8">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📞</span>
                <span className="text-lg">@Instagram</span>
              </div>
            </div>
            
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📘</span>
                <span className="text-lg">@facebook</span>
              </div>
            </div>
            
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">📱</span>
                <span className="text-lg">(42) 9 9999-9999</span>
              </div>
            </div>
          </div>
          
          {/* Direitos reservados */}
          <div className="border-t border-purple-400 pt-6">
            <p className="text-sm">
              TODOS OS DIREITOS RESERVADOS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
