'use server';

import { createClient } from '@/lib/supabase/server';

export async function uploadImagen(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const file = formData.get('file') as File;

  if (!file || file.size === 0) {
    return { error: 'No se seleccionó ningún archivo.' };
  }

  const ext = file.name.split('.').pop() ?? 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('proyectos-imagenes')
    .upload(fileName, file, { contentType: file.type });

  if (error) return { error: error.message };

  const { data } = supabase.storage
    .from('proyectos-imagenes')
    .getPublicUrl(fileName);

  return { url: data.publicUrl };
}
