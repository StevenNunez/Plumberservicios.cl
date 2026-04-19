export type ProyectoDB = {
  id: number;
  titulo: string;
  categoria: string;
  ubicacion: string;
  descripcion: string;
  descripcion_larga?: string | null;
  imagen_principal: string;
  galeria?: string[] | null;
  created_at?: string;
};
