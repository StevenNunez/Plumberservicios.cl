import { createClient } from '@/lib/supabase/server';
import ProyectosView from '@/components/sections/ProyectosView';
import type { ProyectoDB } from '@/lib/supabase/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Proyectos Realizados",
  description:
    "Explorá nuestro portafolio de obras: gasfitería industrial, urbanización, redes de incendio y construcción residencial en Los Ángeles y la Región del Biobío.",
  alternates: {
    canonical: "https://plumberservicios.cl/proyectos",
  },
  openGraph: {
    title: "Proyectos Realizados | Plumber Servicios SPA",
    description:
      "Portafolio de obras ejecutadas: gasfitería, urbanización y construcción en el Biobío.",
    url: "https://plumberservicios.cl/proyectos",
    type: "website",
  },
};

export default async function ProyectosPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('proyectos')
    .select('*')
    .order('created_at', { ascending: false });

  const proyectos: ProyectoDB[] = data ?? [];

  return <ProyectosView proyectos={proyectos} />;
}
