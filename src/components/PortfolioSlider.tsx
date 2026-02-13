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
      transition={{ duration: 0.35 }}
      className="overflow-hidden bg-blue-300 border-t border-gray-200"
    >
      <div className="max-w-full py-0 justify-center text-center">
        <div className="flex mb-6">
          <h2 className="text-6xl font-bold text-cyan-900 py-4">Portfólio</h2>
        </div>

          <div className="relative w-full h-72 mb-10 overflow-hidden">
            <div className="flex flex-nowrap h-full animate-projects-slider">
              {itemsLong.map((project, i) => (
                <div key={`${project.id}-${i}`} className="w-[30rem] h-full flex flex-col items-center justify-center px-2 shrink-0 hover:scale-[1.02] transition-transform duration-300 z-560 first:ml-24">
                  <div className="bg-cyan-100 bg-opacity-95 rounded-2xl shadow-md p-2 w-full max-w-xl border border-gray-200 h-full flex">
                    <div className="flex flex-row gap-2 h-full w-full pt-1">
                      <div className="flex-shrink-0 w-48">
                        <div className="relative w-48 h-48 overflow-hidden rounded-lg bg-gray-200">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="object-cover w-full h-full"
                            loading="lazy"
                          />
                        </div>
                        <p className="mt-2 text-[11px] text-gray-600 leading-tight text-left">
                          O portifolio se encontra no repositorio em "private"
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col min-h-[140px] h-full">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <span className="font-semibold text-gray-900 text-lg block leading-snug">
                              {project.title}
                            </span>
                            <div className="text-xs text-gray-500 font-medium mt-1">
                              {project.category} • Projeto {project.id}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-md text-sm whitespace-nowrap"
                            >
                              Ver Site
                            </a>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm italic mb-2 mt-3">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
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
            <div className="pointer-events-none absolute left-0 top-0 h-full w-7 bg-gradient-to-r from-white/90 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-7 bg-gradient-to-l from-white/90 to-transparent z-10" />
          </div>
      </div>
    </motion.div>
  );
}
