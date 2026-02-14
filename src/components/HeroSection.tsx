'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code2, Zap, Shield } from 'lucide-react';
import { PortfolioSlider } from './PortfolioSlider';
import { openPortfolioAndScroll } from './OpenPortfolioButton';

export function HeroSection() {

  return (
    <>
      <section className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 text-white flex items-center lg:py-1.5 pt-14 lg:pt-0">
        {/* Mobile fixed CTA bar */}
        <div className="fixed lg:static top-0 left-0 right-0 py-1.5 bg-gray-900/80 backdrop-blur-sm z-50 lg:bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
            <div className="lg:hidden flex gap-3 items-center">
              <Button size="lg" onClick={() => openPortfolioAndScroll()}>
                Ver Portifólio
                <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#contact" className="inline-flex items-center justify-center gap-2 border-white text-white hover:text-black bg-cyan-900 hover:bg-gray-400">
                  Começar Projeto
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Conteúdo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col space-y-6"
            >
            <div className="space-y-4">
              <h1 className="text-2xl md:text-6xl font-bold leading-tight">
                Transformando Ideias em
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-400">
                  {' '}
                  Produtos Digitais
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Desenvolvedor Full Stack especializado em criar aplicações web modernas,
                landing pages de alta conversão e soluções tecnológicas escaláveis.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-8 border-y border-gray-700">
              <div className="flex items-center gap-3">
                <Code2 size={24} className="text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Stack</p>
                  <p className="font-semibold">Next.js 15+ / Node.js</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap size={24} className="text-cyan-400" />
                <div>
                  <p className="text-sm text-gray-400">Performance</p>
                  <p className="font-semibold">Otimizado & Rápido</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={24} className="text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Segurança</p>
                  <p className="font-semibold">Produção-Ready</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons (visible on large screens; mobile uses fixed bar) */}
            <div className="hidden lg:flex order-first lg:order-0 gap-3 items-start pt-0">
              <Button size="lg" onClick={() => openPortfolioAndScroll()}>
                Ver Portifólio
                <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#contact" className="inline-flex items-center justify-center gap-2 border-white text-white hover:text-black bg-cyan-900 hover:bg-gray-400">
                  Começar Projeto
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative w-full aspect-square">
              {/* Decorative shapes */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
              <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

              {/* Grid */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-4 grid-rows-4 h-full w-full gap-px bg-white rounded-3xl p-px">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="bg-gray-900 rounded" />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="absolute inset-0 flex flex-col justify-center items-center space-y-8 p-8">
                <div className="text-center">
                  <p className="text-5xl font-bold text-blue-400">2+</p>
                  <p className="text-gray-300">Projetos Entregues</p>
                </div>
                <div className="text-center">
                  <p className="text-5xl font-bold text-cyan-400">100%</p>
                  <p className="text-gray-300">Clientes Satisfeitos</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

      {/* Portfolio slider placed below HeroSection */}
      <PortfolioSlider />
    </>
  );
}
