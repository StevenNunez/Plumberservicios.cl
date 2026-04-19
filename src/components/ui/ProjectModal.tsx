'use client';

import { useEffect } from 'react';
import type { ProyectoDB } from '@/lib/supabase/types';

interface ProjectModalProps {
  project: ProyectoDB | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 md:p-10">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[95vh] bg-white shadow-2xl overflow-y-auto rounded-xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-20 bg-black/40 hover:bg-[var(--primary)] text-white hover:text-[var(--black)] p-1.5 md:p-2 rounded-full transition-all backdrop-blur-md"
        >
          <span className="material-symbols-outlined text-2xl md:text-3xl">close</span>
        </button>

        <div className="flex flex-col lg:flex-row">

          {/* Left Side: Image */}
          <div className="lg:w-2/3 bg-gray-100">
            <div className="h-[260px] sm:h-[340px] lg:sticky lg:top-0 lg:h-[600px]">
              <img
                src={project.imagen_principal}
                alt={project.titulo}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gallery */}
            {project.galeria && project.galeria.length > 1 && (
              <div className="p-4 md:p-6 grid grid-cols-2 gap-3 md:gap-4">
                {project.galeria.slice(1).map((img, idx) => (
                  <div key={idx} className="aspect-video overflow-hidden rounded-lg">
                    <img
                      src={img}
                      alt={`Galería ${idx + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Details */}
          <div className="lg:w-1/3 p-6 md:p-8 lg:p-12 flex flex-col">
            <div className="mb-4 md:mb-6">
              <span className="industrial-font text-xs md:text-sm font-bold text-[var(--primary)] bg-[var(--black)] px-3 py-1 inline-block mb-3 md:mb-4">
                {project.categoria}
              </span>
              <h2 className="industrial-font text-2xl sm:text-3xl md:text-4xl text-[var(--dark-slate)] leading-tight mb-2">
                {project.titulo}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 mt-3 md:mt-4">
                <span className="material-symbols-outlined text-lg md:text-xl">location_on</span>
                <span className="font-medium text-sm md:text-base">{project.ubicacion}</span>
              </div>
            </div>

            <hr className="border-gray-100 my-5 md:my-8" />

            <div className="space-y-5 md:space-y-6">
              <div>
                <h4 className="industrial-font text-base md:text-lg font-bold text-[var(--dark-slate)] mb-2 md:mb-3">
                  Descripción del Proyecto
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {project.descripcion_larga || project.descripcion}
                </p>
              </div>

              <div>
                <h4 className="industrial-font text-base md:text-lg font-bold text-[var(--dark-slate)] mb-2 md:mb-3">
                  Puntos Clave
                </h4>
                <ul className="space-y-2 md:space-y-3">
                  {[
                    'Ejecución bajo normas de seguridad industrial.',
                    'Materiales de primera línea certificados.',
                    'Entrega en plazos establecidos.',
                  ].map((punto) => (
                    <li key={punto} className="flex items-start gap-2 md:gap-3 text-gray-600">
                      <span className="material-symbols-outlined text-[var(--primary)] text-base md:text-xl shrink-0 mt-0.5">
                        check_circle
                      </span>
                      <span className="text-sm md:text-base">{punto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-100">
              <a
                href="https://wa.me/56936256733?text=Hola,%20tengo%20una%20consulta%20sobre%20sus%20proyectos.%20Vengo%20desde%20https://plumberservicios.cl"
                className="w-full bg-[var(--primary)] text-[var(--black)] industrial-font font-bold py-3 md:py-4 rounded-lg flex justify-center items-center gap-2 md:gap-3 hover:bg-[var(--black)] hover:text-[var(--primary)] transition-all shadow-lg text-sm md:text-base"
              >
                CONSULTAR POR PROYECTO SIMILAR
                <span className="material-symbols-outlined text-base md:text-lg">send</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
