import { createClient } from '@/lib/supabase/server';
import DashboardContent from '@/components/dashboard/DashboardContent';
import type { ProyectoDB } from '@/lib/supabase/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard Administrador",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('proyectos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-bold mb-1">Error al cargar proyectos</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return <DashboardContent proyectos={(data as ProyectoDB[]) ?? []} />;
}
