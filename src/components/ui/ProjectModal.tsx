'use client';

import { useEffect, useState } from 'react';
import type { ProyectoDB } from '@/lib/supabase/types';

interface ProjectModalProps {
  project: ProyectoDB | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeImg, setActiveImg] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      setActiveImg(project.imagen_principal);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (lightboxOpen) setLightboxOpen(false);
      else onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, lightboxOpen]);

  if (!project) return null;

  // activeImg puede ser '' durante el primer render antes de que corra el useEffect
  const displayImg = activeImg || project.imagen_principal;
  const galeria = project.galeria ?? [];
  const allImages = [project.imagen_principal, ...galeria];

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 md:p-8">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

        {/* Modal: altura fija, sin scroll global */}
        <div className="relative w-full max-w-6xl h-[90vh] bg-white shadow-2xl rounded-xl overflow-hidden flex flex-col lg:flex-row">

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-[var(--primary)] text-white hover:text-[var(--black)] p-1.5 rounded-full transition-all backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          {/* IZQUIERDA: Visor de imágenes — 45% alto en mobile, 2/3 ancho en desktop */}
          <div className="flex flex-col bg-black h-[45%] lg:h-full lg:w-2/3 shrink-0">

            {/* Imagen activa */}
            <div
              className="relative flex-1 overflow-hidden cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={displayImg}
                alt={project.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1 pointer-events-none">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
                Ampliar
              </div>
            </div>

            {/* Tira de miniaturas */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-2.5 bg-[#0d0d0d] overflow-x-auto shrink-0">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(img)}
                    className={`shrink-0 h-14 w-14 sm:h-16 sm:w-16 lg:h-[70px] lg:w-[70px] rounded overflow-hidden border-2 transition-all ${
                      displayImg === img
                        ? 'border-[var(--primary)] opacity-100'
                        : 'border-transparent opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DERECHA: Detalles (scroll independiente) */}
          <div className="flex-1 lg:w-1/3 lg:flex-none lg:h-full overflow-y-auto flex flex-col p-6 lg:p-10">

            <div className="mb-5">
              <span className="industrial-font text-xs font-bold text-[var(--primary)] bg-[var(--black)] px-3 py-1 inline-block mb-3">
                {project.categoria}
              </span>
              <h2 className="industrial-font text-2xl sm:text-3xl md:text-4xl text-[var(--dark-slate)] leading-tight mb-2">
                {project.titulo}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 mt-3">
                <span className="material-symbols-outlined text-lg">location_on</span>
                <span className="font-medium text-sm">{project.ubicacion}</span>
              </div>
            </div>

            <hr className="border-gray-100 my-5" />

            <div className="space-y-6">
              <div>
                <h4 className="industrial-font text-base font-bold text-[var(--dark-slate)] mb-3">
                  Descripción del Proyecto
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {project.descripcion_larga || project.descripcion}
                </p>
              </div>

              {project.puntos_clave && project.puntos_clave.length > 0 && (
                <div>
                  <h4 className="industrial-font text-base font-bold text-[var(--dark-slate)] mb-3">
                    Puntos Clave
                  </h4>
                  <ul className="space-y-2.5">
                    {project.puntos_clave.map((punto, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-gray-600">
                        <span className="material-symbols-outlined text-[var(--primary)] text-base shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span className="text-sm leading-relaxed">{punto}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {allImages.length > 1 && (
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="material-symbols-outlined text-sm">photo_library</span>
                  <span className="text-xs">
                    {allImages.length} fotos · Haz clic en la imagen para ampliar
                  </span>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <a
                href="https://wa.me/56952235696?text=Hola,%20tengo%20una%20consulta%20sobre%20sus%20proyectos.%20Vengo%20desde%20https://plumberservicios.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[var(--primary)] text-[var(--black)] industrial-font font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-[var(--black)] hover:text-[var(--primary)] transition-all shadow-lg text-sm"
              >
                CONSULTAR POR PROYECTO SIMILAR
                <span className="material-symbols-outlined text-base">send</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 md:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            aria-label="Cerrar imagen"
            className="absolute top-4 right-4 bg-white/10 hover:bg-[var(--primary)] hover:text-[var(--black)] text-white p-2 rounded-full transition-all"
            onClick={() => setLightboxOpen(false)}
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <img
            src={displayImg}
            alt="Vista ampliada"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
