import { ProjectsGrid } from '@/components/ProjectsGrid';
import projects from '@/data/projects.json';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Portifólio de Projetos | Full Stack Developer',
  description:
    'Confira meus projetos em produção: Amendoeira do Cerrado, Escala IEVV Music, e mais. Desenvolvidos com Next.js, TypeScript, Prisma e as melhores práticas.',
  keywords: 'projetos, portifólio, full stack, next.js, react, typescript, nodejs',
  openGraph: {
    title: 'Portifólio de Projetos | Full Stack Developer',
    description:
      'Projetos profissionais desenvolvidos com Next.js, TypeScript e Prisma. Exemplos de código limpo e segurança em produção.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Portifólio de Projetos',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portifólio de Projetos | Full Stack Developer',
    description:
      'Confira meus projetos profissionais desenvolvidos com tecnologias modernas.',
  },
  robots: 'index, follow',
  canonical: 'https://portifolio-three-eta-92.vercel.app/portifolio',
};

import { redirect } from 'next/navigation';

export default function PortifolioPage() {
  // Route removed: redirect to homepage which now exposes the Portfolio slider
  redirect('/');
}
