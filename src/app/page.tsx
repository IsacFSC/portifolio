import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ContactFormHF } from '@/components/ContactFormHF';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import { OpenPortfolioButton } from '@/components/OpenPortfolioButton';

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

      {/* Contato */}
      <section id="contact" className="py-20 relative overflow-hidden bg-linear-to-br from-slate-100 via-blue-100/85 to-violet-100/70">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-blue-500/25 via-violet-400/15 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-14 top-14 h-32 w-40 rounded-full bg-blue-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 bottom-8 h-36 w-44 rounded-full bg-emerald-400/20 blur-3xl"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Vamos Trabalhar Juntos?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Conte sua ideia e eu retorno com um plano objetivo para seu site sair do papel e gerar resultados.
            </p>
          </div>

          <div className="relative overflow-hidden bg-white/85 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-200/70 shadow-lg">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-20 w-16 bg-linear-to-r from-blue-400/35 via-transparent to-violet-400/25 blur-md"
            />
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
                  <OpenPortfolioButton className="hover:text-white transition-colors text-gray-400">
                    Portifólio
                  </OpenPortfolioButton>
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
