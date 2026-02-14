'use client';

import { motion } from 'framer-motion';
import { Code2, Smartphone, Zap, Database, Lock, TrendingUp } from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'Desenvolvimento Web',
    description: 'Aplicações web modernas com Next.js, React e TypeScript. Full stack pronto para produção.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Apps multiplataforma com React Native e Expo. Interface intuitiva e performance otimizada.',
  },
  {
    icon: Database,
    title: 'Backend & Banco de Dados',
    description: 'APIs escaláveis com Node.js, Prisma e PostgreSQL. Arquitetura profissional.',
  },
  {
    icon: Zap,
    title: 'Landing Pages',
    description: 'Landing pages de alto impacto com conversão otimizada. Design moderno e responsivo.',
  },
  {
    icon: Lock,
    title: 'Segurança',
    description: 'Implementação de boas práticas de segurança. Proteção contra vulnerabilidades.',
  },
  {
    icon: TrendingUp,
    title: 'Consultoria',
    description: 'Orientação técnica e arquitetura de projetos. Stack otimizado para seu caso de uso.',
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 bg-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Serviços Oferecidos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Soluções completas em desenvolvimento de software para pequenos e grandes negócios
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-gray-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 group-hover:bg-blue-700 rounded-lg mb-4">
                  <Icon size={24} className="text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 group-hover:text-blue-100">{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
