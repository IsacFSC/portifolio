'use client';

import React from 'react';
import { motion } from 'framer-motion';
import projects from '@/data/projects.json';

export function PortfolioSlider() {
  // Use all projects for the marquee; duplicate once for continuous loop
  const items = projects as any[];
  const itemsLong = [...items, ...items, ...items]; // triplicate for smoother loop on slower speeds

  return (
    <motion.div
      id="portfolio-slider"
      key="portfolio-marquee"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="overflow-hidden bg-blue-300 border-t border-gray-200"
    >
      <div className="max-w-full py-0 justify-center text-center">
        <div className="flex mb-6">
          <h2 className="text-6xl font-bold text-cyan-900 text-center py-4">Portifólio</h2>
        </div>

          <div className="relative lg:w-full md:w-full h-72 mb-10 overflow-hidden">
            <div className="flex flex-nowrap h-full animate-projects-slider">
              {itemsLong.map((project, i) => (
                <div key={`${project.id}-${i}`}
                  className="md:w-96 lg:w-[30rem] h-full flex flex-col items-center justify-center px-2 shrink-0 hover:scale-[1.02] transition-transform duration-300 z-100"
                >
                  <div className="bg-cyan-100 bg-opacity-95 rounded-2xl shadow-md p-1 sm:p-2 w-full max-w-xl border border-gray-200 h-full flex relative">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 h-full w-full pt-1 overflow-y-auto">
                      <div className="shrink-0 w-full sm:w-40 lg:w-48">
                        <div className="relative w-full sm:w-40 lg:w-48 h-24 sm:h-40 lg:h-48 md:mt-2 overflow-hidden rounded-lg bg-gray-200">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        </div>
                        <p className="mt-2 md:mt-3 text-[11px] text-gray-600 leading-tight text-left">
                          O portifolio se encontra no repositorio em "private"
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

                          <div className="block absolute bottom-3 right-3 shrink-0">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2 py-1 sm:px-2 sm:py-1 rounded-md text-xs sm:text-sm whitespace-nowrap"
                            >
                              Ver Site
                            </a>
                          </div>
                        </div>

                        <p className="hidden lg:block text-gray-700 text-sm italic">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2 items-start">
                          {project.technologies.slice(0, 6).map((tech: string) => (
                            <span key={tech} className="block bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Side shadows */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-linear-to-r from-white/90 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-linear-to-l from-white/90 to-transparent z-10" />
          </div>
      </div>
    </motion.div>
  );
}
