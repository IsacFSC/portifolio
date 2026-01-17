import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactFormHF } from '@/components/ContactFormHF';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Full Stack Developer | Portifólio Profissional',
  description:
    'Este é o meu site oficial para divulgar meu trabalho. Confira exemplos de projetos em produção e solicite seu projeto pelo formulário.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <HeroSection />

      {/* Services */}
      <ServicesSection />

      {/* CTA para Portifólio */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Veja Meu Portifólio
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Confira alguns dos projetos que tive o prazer de desenvolver. Cada um representa
            dedicação, inovação e qualidade.
          </p>
          <Link
            href="/portifolio"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            Acessar Portifólio
          </Link>
        </div>
      </section>

      {/* Contato */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vamos Trabalhar Juntos?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tenho uma ideia? Quer conversar sobre seu projeto? Envie uma mensagem!
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 md:p-12">
            <ContactFormHF />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4">Sobre</h3>
              <p className="text-gray-400">
                Full Stack Developer com paixão por criar produtos digitais de qualidade.
                Especialista em Next.js, React e Node.js.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/portifolio" className="hover:text-white transition-colors">
                    Portifólio
                  </Link>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    href="/admin"
                    className="text-gray-400 hover:text-white transition-colors text-xs font-semibold"
                    title="Painel de Administração Restrito"
                  >
                    🔐 Restrito a Admin
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-bold mb-4">Redes Sociais</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Projects. Todos os direitos reservados.
            </p>
          </div>
        
          <div className="mt-4 text-center flex items-center space-x-2 justify-center">
            <Link href="https://github.com/IsacFSC" target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm inline-flex items-center hover:text-white transition-colors gap-2">
              <span>Desenvolvido por <strong>IsacFSC</strong></span>
              <Github size={20} />
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
