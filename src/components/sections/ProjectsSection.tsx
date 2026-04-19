import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { ProyectoDB } from '@/lib/supabase/types';

export default async function ProjectsSection() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4);

  const proyectos: ProyectoDB[] = (data as ProyectoDB[]) ?? [];

  if (proyectos.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-[var(--slate-bg)]" id="proyectos">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-[var(--dark-slate)] mb-2">Proyectos Realizados</h2>
            <p className="text-gray-500 font-medium">Experiencia comprobada en obras de gran envergadura</p>
          </div>
          <Link
            className="text-[var(--dark-slate)] font-bold industrial-font border-b-2 border-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
            href="/proyectos"
          >
            Ver todos los proyectos
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {proyectos.map((proyecto) => (
            <article
              key={proyecto.id}
              className="bg-white group overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="h-56 overflow-hidden">
                <img
                  alt={proyecto.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={proyecto.imagen_principal}
                />
              </div>
              <div className="p-5">
                <p className="text-[10px] text-gray-400 industrial-font mb-1">{proyecto.categoria}</p>
                <h3 className="text-lg font-bold text-[var(--dark-slate)]">{proyecto.titulo}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
