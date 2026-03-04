'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import projects from '@/data/projects.json';

interface SliderProject {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  link: string;
  github?: string;
  category: string;
}

export function PortfolioSlider() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const items = projects as SliderProject[];

  const updateNavState = () => {
    const el = carouselRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 12);
    setCanNext(el.scrollLeft < maxScrollLeft - 12);
  };

  const scrollByCards = (direction: 'prev' | 'next') => {
    const el = carouselRef.current;
    if (!el) return;

    const amount = Math.max(el.clientWidth * 0.85, 280);
    el.scrollBy({
      left: direction === 'next' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    updateNavState();
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateNavState, { passive: true });
    window.addEventListener('resize', updateNavState);

    return () => {
      el.removeEventListener('scroll', updateNavState);
      window.removeEventListener('resize', updateNavState);
    };
  }, []);

  return (
    <motion.div
      id="portfolio-slider"
      key="portfolio-marquee"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative overflow-hidden border-t border-blue-200/70 bg-linear-to-br from-slate-100 via-blue-100/90 to-violet-100/80"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-blue-500/25 via-violet-400/15 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 h-32 w-40 rounded-full bg-blue-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-8 h-36 w-44 rounded-full bg-emerald-400/20 blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <div className="mb-6">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-950 text-center">Portifólio</h2>
          <p className="mt-3 text-sm sm:text-base text-blue-900/80 max-w-2xl mx-auto">
            Explore projetos reais, avance no seu ritmo e abra os cases que combinam com o seu negócio.
          </p>
        </div>

          <div className="relative w-full mb-8">
            <div className="flex justify-end mb-3 sm:mb-0 sm:absolute sm:right-0 sm:-top-14 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => scrollByCards('prev')}
                disabled={!canPrev}
                aria-label="Voltar projetos"
                className="bg-white/80 border-blue-200 hover:bg-blue-50"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => scrollByCards('next')}
                disabled={!canNext}
                aria-label="Avançar projetos"
                className="bg-white/80 border-blue-200 hover:bg-blue-50"
              >
                <ChevronRight size={18} />
              </Button>
            </div>

            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:thin]"
              aria-label="Lista de projetos"
            >
              {items.map((project, i) => (
                <div
                  key={project.id}
                  className="snap-start min-w-[86%] sm:min-w-[64%] lg:min-w-[46%] xl:min-w-[38%] h-84 flex flex-col items-center justify-center shrink-0"
                >
                  <article className="group relative bg-white/85 backdrop-blur-[2px] rounded-2xl shadow-md hover:shadow-xl p-1 sm:p-2 w-full max-w-xl border border-blue-200/70 h-full flex transition-all duration-500 focus-within:scale-[1.01] hover:scale-[1.01]">
                    <motion.div
                      aria-hidden="true"
                      initial={{ x: '-120%' }}
                      animate={{ x: ['-120%', '140%'] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: (i % items.length) * 0.2 }}
                      className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-transparent via-blue-400/40 to-transparent blur-md"
                    />

                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 h-full w-full pt-1 overflow-y-auto relative z-10">
                      <div className="shrink-0 w-full sm:w-40 lg:w-48">
                        <div className="relative w-full sm:w-40 lg:w-48 h-24 sm:h-40 lg:h-48 md:mt-2 overflow-hidden rounded-lg bg-gray-200">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 160px, 192px"
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <p className="mt-2 md:mt-3 text-[11px] text-gray-600 leading-tight text-left">
                          Demonstração pública do produto. Versão de código pode estar privada.
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col min-h-35 h-full pb-10">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 text-sm sm:text-lg block leading-snug">
                              {project.title}
                            </span>
                            <div className="sm:my-1 text-xs text-gray-500 font-medium mt-1">
                              {project.category} • Projeto {project.id}
                            </div>
                          </div>
                        </div>

                        <p className="hidden lg:block text-gray-700 text-sm italic">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2 items-start">
                          {project.technologies.slice(0, 6).map((tech: string) => (
                            <span key={tech} className="block bg-blue-100/70 text-blue-900 text-xs px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto pt-3 flex gap-2 absolute bottom-3 right-3">
                          <Button asChild size="sm" className="h-8 px-3 text-xs">
                            <Link href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Ver projeto ${project.title}`}>
                              <ExternalLink size={14} className="mr-1.5" />
                              Ver Case
                            </Link>
                          </Button>

                          {project.github && (
                            <Button asChild variant="outline" size="sm" className="h-8 px-2.5">
                              <Link href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`Ver código no GitHub de ${project.title}`}>
                                <Github size={14} />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs sm:text-sm text-blue-950/70 text-left sm:text-center">
              Dica: arraste no celular ou use os botões para navegar pelos projetos.
            </p>

            {/* Side shadows */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-linear-to-r from-blue-50/85 via-indigo-50/40 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-linear-to-l from-emerald-50/85 via-violet-50/40 to-transparent z-10" />
          </div>
      </div>
    </motion.div>
  );
}
