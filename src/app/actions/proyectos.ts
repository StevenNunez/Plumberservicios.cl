'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type ProyectoInput = {
  id?: number;
  titulo: string;
  categoria: string;
  ubicacion: string;
  descripcion: string;
  descripcion_larga?: string;
  imagen_principal: string;
  galeria?: string[];
};

export async function crearProyecto(data: ProyectoInput) {
  const supabase = await createClient();

  const { error } = await supabase.from('proyectos').insert({
    titulo: data.titulo,
    categoria: data.categoria,
    ubicacion: data.ubicacion,
    descripcion: data.descripcion,
    descripcion_larga: data.descripcion_larga,
    imagen_principal: data.imagen_principal,
    galeria: data.galeria ?? [],
  });

  if (error) return { error: error.message };

  revalidatePath('/proyectos');
  revalidatePath('/');
  return { success: true };
}

export async function actualizarProyecto(data: ProyectoInput) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('proyectos')
    .update({
      titulo: data.titulo,
      categoria: data.categoria,
      ubicacion: data.ubicacion,
      descripcion: data.descripcion,
      descripcion_larga: data.descripcion_larga,
      imagen_principal: data.imagen_principal,
      galeria: data.galeria ?? [],
    })
    .eq('id', data.id!);

  if (error) return { error: error.message };

  revalidatePath('/proyectos');
  revalidatePath('/');
  return { success: true };
}

export async function eliminarProyecto(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from('proyectos').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/proyectos');
  revalidatePath('/');
  return { success: true };
}
