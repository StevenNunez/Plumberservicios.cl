'use client';

import { useState, useTransition } from 'react';
import { eliminarProyecto } from '@/app/actions/proyectos';
import ProyectoFormModal from './ProyectoFormModal';
import MercadoPagoGenerator from './MercadoPagoGenerator';
import type { ProyectoDB } from '@/lib/supabase/types';

export default function DashboardContent({
  proyectos: initialProyectos,
}: {
  proyectos: ProyectoDB[];
}) {
  const [proyectos, setProyectos] = useState(initialProyectos);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProyectoDB | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(proyecto: ProyectoDB) {
    setEditing(proyecto);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditing(null);
    // Recarga la página para reflejar cambios (Server Component data refresh)
    window.location.reload();
  }

  function handleDelete(id: number) {
    if (!confirm('¿Eliminar este proyecto? Esta acción no se puede deshacer.')) return;
    setDeletingId(id);
    startTransition(async () => {
      const result = await eliminarProyecto(id);
      if (!result?.error) {
        setProyectos((prev) => prev.filter((p) => p.id !== id));
      }
      setDeletingId(null);
    });
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="industrial-font text-3xl text-[var(--dark-slate)]">
            Panel de Administración
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {proyectos.length} proyecto{proyectos.length !== 1 ? 's' : ''} en el portafolio
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[var(--primary)] text-[var(--black)] industrial-font font-bold px-5 py-2.5 rounded-lg hover:bg-[var(--primary-hover)] transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Tabla de proyectos */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-[var(--dark-slate)]">Proyectos</h2>
            </div>

            {proyectos.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <span className="material-symbols-outlined text-5xl block mb-3">
                  construction
                </span>
                <p className="text-sm">No hay proyectos todavía.</p>
                <button
                  onClick={openCreate}
                  className="mt-4 text-sm text-[var(--primary)] font-medium hover:underline"
                >
                  Crear el primero
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {proyectos.map((proyecto) => (
                  <div
                    key={proyecto.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      {proyecto.imagen_principal ? (
                        <img
                          src={proyecto.imagen_principal}
                          alt={proyecto.titulo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-300 text-2xl">
                            image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--dark-slate)] truncate text-sm">
                        {proyecto.titulo}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          {proyecto.categoria}
                        </span>
                        <span className="text-xs text-gray-400">
                          {proyecto.ubicacion}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit(proyecto)}
                        className="p-2 text-gray-400 hover:text-[var(--dark-slate)] hover:bg-gray-100 rounded-lg transition-all"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(proyecto.id)}
                        disabled={deletingId === proyecto.id || isPending}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40"
                        title="Eliminar"
                      >
                        {deletingId === proyecto.id ? (
                          <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full inline-block" />
                        ) : (
                          <span className="material-symbols-outlined text-lg">delete</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Generador Mercado Pago */}
        <div>
          <MercadoPagoGenerator />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <ProyectoFormModal
          proyecto={editing}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
