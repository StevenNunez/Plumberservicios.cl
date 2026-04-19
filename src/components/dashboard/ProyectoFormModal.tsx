'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { crearProyecto, actualizarProyecto } from '@/app/actions/proyectos';
import { uploadImagen } from '@/app/actions/upload';
import type { ProyectoDB } from '@/lib/supabase/types';

const CATEGORIAS = [
  'Gasfitería',
  'Urbanización',
  'Obras Menores',
  'Construcción',
  'Residencial',
  'Industrial',
];

// Comprime y redimensiona una imagen en el navegador antes de subirla.
// Maneja fotos de teléfono (EXIF orientation, tamaños >4000px, HEIC convertido a WebP).
async function compressImage(file: File, maxWidth = 1920, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Calcular nuevas dimensiones manteniendo proporción
      const ratio = Math.min(maxWidth / img.width, 1);
      const width = Math.round(img.width * ratio);
      const height = Math.round(img.height * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas no disponible')); return; }

      // drawImage respeta la orientación EXIF en navegadores modernos
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Error al comprimir imagen')); return; }
          // Guardamos como WebP (30-50% más liviano que JPEG)
          const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
          resolve(new File([blob], name, { type: 'image/webp' }));
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('No se pudo leer la imagen'));
    };

    img.src = objectUrl;
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  proyecto?: ProyectoDB | null;
  onClose: () => void;
}

export default function ProyectoFormModal({ proyecto, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(proyecto?.imagen_principal ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<{ original: number; compressed: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setCompressing(true);
    setSizeInfo(null);
    setError(null);

    try {
      const compressed = await compressImage(file);
      setSizeInfo({ original: file.size, compressed: compressed.size });
      setImageFile(compressed);
      setImagePreview(URL.createObjectURL(compressed));
    } catch {
      setError('No se pudo procesar la imagen. Probá con otra foto.');
    } finally {
      setCompressing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let imagenUrl = imagePreview;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        const uploadResult = await uploadImagen(uploadData);
        if ('error' in uploadResult) {
          setError(uploadResult.error);
          return;
        }
        imagenUrl = uploadResult.url;
      }

      const data = {
        titulo: formData.get('titulo') as string,
        categoria: formData.get('categoria') as string,
        ubicacion: formData.get('ubicacion') as string,
        descripcion: formData.get('descripcion') as string,
        descripcion_larga: formData.get('descripcion_larga') as string,
        imagen_principal: imagenUrl,
      };

      const result = proyecto?.id
        ? await actualizarProyecto({ ...data, id: proyecto.id })
        : await crearProyecto(data);

      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="industrial-font text-xl text-[var(--dark-slate)]">
            {proyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              name="titulo"
              required
              defaultValue={proyecto?.titulo ?? ''}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Ej: Instalación de Sala de Bombas"
            />
          </div>

          {/* Categoría y Ubicación */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="categoria"
                required
                defaultValue={proyecto?.categoria ?? ''}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white"
              >
                <option value="">Seleccionar...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación <span className="text-red-500">*</span>
              </label>
              <input
                name="ubicacion"
                required
                defaultValue={proyecto?.ubicacion ?? ''}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="Ej: Los Ángeles, Biobío"
              />
            </div>
          </div>

          {/* Descripción corta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción corta <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              required
              rows={2}
              defaultValue={proyecto?.descripcion ?? ''}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              placeholder="Resumen breve del proyecto"
            />
          </div>

          {/* Descripción larga */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción detallada
            </label>
            <textarea
              name="descripcion_larga"
              rows={4}
              defaultValue={proyecto?.descripcion_larga ?? ''}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              placeholder="Descripción completa que se mostrará en el modal"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen principal
            </label>
            <div className="flex gap-4 items-start">
              {/* Preview */}
              {imagePreview && (
                <div className="relative shrink-0">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  {compressing && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full inline-block" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={compressing}
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-[var(--primary)] rounded-lg px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-all w-full justify-center disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-xl">
                    {compressing ? 'hourglass_empty' : 'upload'}
                  </span>
                  {compressing
                    ? 'Optimizando imagen...'
                    : imageFile
                    ? imageFile.name
                    : 'Seleccionar foto'}
                </button>

                {/* Info de compresión */}
                {sizeInfo && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>
                      Optimizada: {formatBytes(sizeInfo.original)} →{' '}
                      <strong>{formatBytes(sizeInfo.compressed)}</strong>
                      {' '}({Math.round((1 - sizeInfo.compressed / sizeInfo.original) * 100)}% menos)
                    </span>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-1.5">
                  Fotos de teléfono bienvenidas — se optimizan automáticamente antes de subir.
                </p>
              </div>
            </div>

            {/* URL manual */}
            <input
              type="url"
              placeholder="O pegar URL de imagen directamente"
              value={imageFile ? '' : imagePreview}
              onChange={(e) => {
                setImageFile(null);
                setSizeInfo(null);
                setImagePreview(e.target.value);
              }}
              className="mt-2 w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-gray-500"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || compressing}
              className="px-5 py-2.5 text-sm font-bold industrial-font bg-[var(--primary)] text-[var(--black)] rounded-lg hover:bg-[var(--primary-hover)] transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {isPending ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full inline-block" />
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">save</span>
                  {proyecto ? 'Actualizar' : 'Crear Proyecto'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
