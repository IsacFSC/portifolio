'use client';

import { motion } from 'framer-motion';
import { Code2, Smartphone, Zap, Database, Lock, TrendingUp } from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'Desenvolvimento Web',
    description: 'Sites e sistemas profissionais para apresentar sua marca com clareza e transformar visitas em contatos.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description: 'Experiência fluida em celular, com interface intuitiva e foco total na jornada do seu cliente.',
  },
  {
    icon: Database,
    title: 'Backend & Banco de Dados',
    description: 'Estrutura sólida para seu projeto crescer com segurança, estabilidade e organização dos dados.',
  },
  {
    icon: Zap,
    title: 'Landing Pages',
    description: 'Páginas de alta conversão para campanhas, lançamentos e captação de novos clientes.',
  },
  {
    icon: Lock,
    title: 'Segurança',
    description: 'Boas práticas de segurança aplicadas desde o início para proteger seus dados e sua operação.',
  },
  {
    icon: TrendingUp,
    title: 'Consultoria',
    description: 'Direcionamento técnico para você investir no que realmente traz resultado para o negócio.',
  },
];

export function ServicesSection() {
  return (
    <section className="py-20 relative overflow-hidden bg-linear-to-br from-slate-100 via-blue-100/85 to-emerald-100/75">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-blue-500/30 via-violet-400/15 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-6 h-32 w-40 rounded-full bg-violet-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-12 h-36 w-44 rounded-full bg-emerald-400/20 blur-3xl"
      />

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
            Soluções digitais para atrair clientes, melhorar sua presença online e acelerar resultados.
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
                className="group relative overflow-hidden p-8 bg-white/80 backdrop-blur-[2px] rounded-xl border border-blue-200/70 hover:border-blue-500/60 hover:bg-white/90 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-16 w-16 bg-linear-to-r from-blue-400/40 via-transparent to-violet-400/35 blur-md transition-transform duration-1000 ease-out group-hover:translate-x-112"
                />

                <div className="relative z-10 inline-flex items-center justify-center w-12 h-12 bg-blue-100 group-hover:bg-blue-600 rounded-lg mb-4 transition-colors duration-500">
                  <Icon size={24} className="text-blue-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="relative z-10 text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-900 transition-colors duration-500">
                  {service.title}
                </h3>
                <p className="relative z-10 text-gray-600 group-hover:text-gray-700 transition-colors duration-500">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
