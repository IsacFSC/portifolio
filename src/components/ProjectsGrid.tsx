'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  link: string;
  github?: string;
  featured: boolean;
  category: string;
}

interface ProjectsGridProps {
  projects: Project[];
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="space-y-16">
      {/* Projetos em Destaque */}
      {featuredProjects.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Projetos em Destaque</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end justify-start p-4">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={project.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} className="mr-2" />
                        Ver Projeto
                      </Link>
                    </Button>
                    {project.github && (
                      <Button
                        asChild
                        variant="outline"
                      >
                        <Link href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github size={16} />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Outros Projetos */}
      {otherProjects.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Outros Projetos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{project.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 2).map((tech) => (
                      <span
                        key={tech}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 2 && (
                      <span className="text-gray-500 text-xs px-2 py-1">
                        +{project.technologies.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={project.link} target="_blank" rel="noopener noreferrer">
                        Ver
                      </Link>
                    </Button>
                    {project.github && (
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                      >
                        <Link href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github size={20} />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
