import { ProjectsGrid } from '@/components/ProjectsGrid';
import projects from '@/data/projects.json';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Portfólio de Projetos | Full Stack Developer',
  description:
    'Confira meus projetos em produção: Amendoeira do Cerrado, Escala IEVV Music, e mais. Desenvolvidos com Next.js, TypeScript, Prisma e as melhores práticas.',
  keywords: 'projetos, portfólio, full stack, next.js, react, typescript, nodejs',
  openGraph: {
    title: 'Portfólio de Projetos | Full Stack Developer',
    description:
      'Projetos profissionais desenvolvidos com Next.js, TypeScript e Prisma. Exemplos de código limpo e segurança em produção.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Portfólio de Projetos',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfólio de Projetos | Full Stack Developer',
    description:
      'Confira meus projetos profissionais desenvolvidos com tecnologias modernas.',
  },
  robots: 'index, follow',
  canonical: 'https://portifolio-three-eta-92.vercel.app/portifolio',
};

export default function PortifolioPage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb e Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            Voltar
          </Link>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Portfólio de Projetos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Confira alguns dos projetos que tive o prazer de desenvolver. Cada um representa
              dedicação à qualidade, segurança e performance.
            </p>
          </div>
        </div>
      </div>

      {/* Projetos em Destaque */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {featuredProjects.length > 0 && (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-12">Projetos em Destaque</h2>
              <ProjectsGrid projects={featuredProjects} />
            </>
          )}
        </div>
      </section>

      {/* Outros Projetos */}
      {otherProjects.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Outros Projetos</h2>
            <ProjectsGrid projects={otherProjects} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tem um projeto em mente?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Conversar sobre como posso ajudar você é sempre um prazer.
          </p>
          <Link
            href="/#contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Solicitar Orçamento
          </Link>
        </div>
      </section>
    </main>
  );
}
