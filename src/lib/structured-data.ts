// lib/structured-data.ts
export const getPersonSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'IsacFSC',
  jobTitle: 'Full Stack Developer',
  description:
    'Desenvolvedor Full Stack especializado em Next.js, TypeScript, React Native e PostgreSQL',
  url: 'https://portifolio-three-eta-92.vercel.app',
  sameAs: [
    'https://github.com/seu-usuario',
    'https://linkedin.com/in/seu-usuario',
    'https://twitter.com/seu-usuario',
  ],
  knowsAbout: [
    'Next.js',
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Prisma',
    'Full Stack Development',
  ],
});

export const getPortfolioSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Portfólio de Projetos',
  description: 'Coleção de projetos profissionais desenvolvidos com Next.js e tecnologias modernas',
  url: 'https://portifolio-three-eta-92.vercel.app/portfolio',
});

export const getProjectSchema = (project: {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  technologies: string[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: project.title,
  description: project.description,
  image: project.imageUrl,
  url: project.link,
  programmingLanguage: project.technologies,
  author: {
    '@type': 'Person',
    name: 'IsacFSC',
  },
});

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'IsacFSC - Full Stack Developer',
  description:
    'Desenvolvedor Full Stack especializado em criação de soluções web modernas e seguras',
  url: 'https://portifolio-three-eta-92.vercel.app',
  sameAs: [
    'https://github.com/seu-usuario',
    'https://linkedin.com/in/seu-usuario',
  ],
});
