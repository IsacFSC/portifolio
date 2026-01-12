import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { ProjectsGrid } from '@/components/ProjectsGrid';
import { ContactFormHF } from '@/components/ContactFormHF';
import projects from '@/data/projects.json';
import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Portfólio | Full Stack Developer',
  description:
    'Desenvolvedor Full Stack especializado em Next.js, React Native e PostgreSQL. Criando soluções web e mobile de alto impacto.',
  openGraph: {
    title: 'Portfólio | Full Stack Developer',
    description: 'Transformando ideias em produtos digitais de qualidade',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Full Stack Developer Portfolio',
      },
    ],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <HeroSection />

      {/* Services */}
      <ServicesSection />

      {/* Portfólio */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Portfólio de Projetos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Confira alguns dos projetos que tive o prazer de desenvolver. Cada um representa
              dedicação, inovação e qualidade.
            </p>
          </div>

          <ProjectsGrid projects={projects} />
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
                  <a href="#portfolio" className="hover:text-white transition-colors">
                    Portfólio
                  </a>
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
            <p>
              &copy; {new Date().getFullYear()} IsacFSC. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
