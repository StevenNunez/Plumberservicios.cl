'use client';

import { useState } from 'react';
import ProjectModal from '@/components/ui/ProjectModal';
import type { ProyectoDB } from '@/lib/supabase/types';

const CATEGORIAS = ['Todos', 'Gasfitería', 'Urbanización', 'Obras Menores', 'Construcción', 'Residencial', 'Industrial'];

export default function ProyectosView({ proyectos }: { proyectos: ProyectoDB[] }) {
  const [selectedProject, setSelectedProject] = useState<ProyectoDB | null>(null);
  const [filtro, setFiltro] = useState('Todos');

  const filtered = filtro === 'Todos' ? proyectos : proyectos.filter((p) => p.categoria === filtro);
  const [featured, ...rest] = filtered;

  return (
    <main className="container mx-auto px-4 py-16 md:py-24 flex-grow">
      {/* Header */}
      <header className="mb-10 md:mb-16">
        <h1 className="industrial-font text-5xl md:text-7xl text-[var(--dark-slate)] mb-4 md:mb-6">
          Proyectos<br />
          <span className="text-[var(--primary)]">Ejecutados</span>
        </h1>
        <p className="text-base md:text-xl text-gray-600 max-w-2xl leading-relaxed">
          Nuestra experiencia se traduce en obras concretas. Explorá nuestro portafolio de proyectos
          de gasfitería, urbanización y obras menores, donde la precisión técnica se encuentra con
          la calidad industrial.
        </p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-12">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`industrial-font font-bold text-xs md:text-sm px-4 py-2 md:px-6 md:py-2.5 uppercase tracking-wide transition-all ${
              filtro === cat
                ? 'bg-[var(--primary)] text-[var(--black)]'
                : 'bg-transparent border-2 border-gray-200 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-gray-400">
          <span className="material-symbols-outlined text-6xl block mb-4">construction</span>
          <p className="text-lg">No hay proyectos en esta categoría todavía.</p>
        </div>
      ) : (
        <>
          {/* Proyecto Destacado */}
          {featured && (
            <article className="group relative rounded-lg overflow-hidden mb-6 md:mb-8 h-[420px] md:h-[500px] flex items-end shadow-lg">
              <div className="absolute inset-0">
                <img
                  alt={featured.titulo}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={featured.imagen_principal}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
              </div>
              <div className="relative z-10 p-6 md:p-12 w-full md:w-2/3">
                <div className="flex items-center gap-2 mb-2 md:mb-3 text-[var(--primary)]">
                  <span className="material-symbols-outlined text-sm md:text-base">location_on</span>
                  <span className="industrial-font text-xs md:text-sm uppercase tracking-widest font-bold">
                    {featured.ubicacion}
                  </span>
                </div>
                <h2 className="industrial-font text-3xl md:text-5xl text-white mb-3 md:mb-4 leading-tight">
                  {featured.titulo}
                </h2>
                <p className="text-gray-300 text-sm md:text-base mb-4 md:mb-5 leading-relaxed max-w-lg line-clamp-3 md:line-clamp-none">
                  {featured.descripcion}
                </p>
                <span className="inline-block border border-white/40 text-white industrial-font text-xs px-4 py-1.5 rounded-full uppercase tracking-widest mb-5 md:mb-8">
                  {featured.categoria}
                </span>
                <div>
                  <button
                    onClick={() => setSelectedProject(featured)}
                    className="bg-[var(--primary)] text-[var(--black)] industrial-font font-bold py-3 px-6 md:px-8 hover:bg-white transition-all flex items-center gap-2 group/btn text-sm md:text-base"
                  >
                    Ver Detalles
                    <span className="material-symbols-outlined text-base md:text-lg transition-transform group-hover/btn:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* Grid de proyectos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {rest.map((proyecto) => (
              <article
                key={proyecto.id}
                className="group relative rounded-lg overflow-hidden h-[380px] md:h-[480px] flex flex-col justify-end shadow-lg"
              >
                <div className="absolute inset-0">
                  <img
                    alt={proyecto.titulo}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={proyecto.imagen_principal}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10" />
                </div>

                <div className="relative z-10 p-5 md:p-7 flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center gap-1.5 text-[var(--primary)]">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span className="industrial-font text-xs uppercase tracking-widest font-bold">
                      {proyecto.ubicacion}
                    </span>
                  </div>
                  <h2 className="industrial-font text-2xl md:text-3xl text-white leading-tight">
                    {proyecto.titulo}
                  </h2>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-2">
                    {proyecto.descripcion}
                  </p>
                  <span className="inline-block self-start border border-white/40 text-white industrial-font text-[10px] px-3 py-1 rounded-full uppercase tracking-widest">
                    {proyecto.categoria}
                  </span>
                  <button
                    onClick={() => setSelectedProject(proyecto)}
                    className="mt-1 w-full bg-white/10 hover:bg-[var(--primary)] hover:text-[var(--black)] text-white border border-white/25 backdrop-blur-sm industrial-font font-bold py-3 px-6 rounded-sm transition-all flex justify-center items-center gap-2 group/btn text-sm"
                  >
                    Ver Detalles
                    <span className="material-symbols-outlined text-base transition-transform group-hover/btn:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </main>
  );
}
