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
  const DEFAULT_PUNTOS = [
    'Ejecución bajo normas de seguridad industrial.',
    'Materiales de primera línea certificados.',
    'Entrega en plazos establecidos.',
  ];

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(proyecto?.imagen_principal ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(proyecto?.galeria ?? []);
  const [galleryFiles, setGalleryFiles] = useState<{ file: File; preview: string }[]>([]);
  const [puntos, setPuntos] = useState<string[]>(
    proyecto?.puntos_clave && proyecto.puntos_clave.length > 0
      ? proyecto.puntos_clave
      : DEFAULT_PUNTOS
  );
  const [compressing, setCompressing] = useState(false);
  const [sizeInfo, setSizeInfo] = useState<{ original: number; compressed: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

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

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setCompressing(true);
    try {
      const compressedFiles = await Promise.all(files.map(f => compressImage(f)));
      const newItems = compressedFiles.map(f => ({
        file: f,
        preview: URL.createObjectURL(f)
      }));
      setGalleryFiles(prev => [...prev, ...newItems]);
    } catch {
      setError('Error al procesar las imágenes de la galería.');
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

      const newGalleryUrls: string[] = [];
      for (const item of galleryFiles) {
        const uploadData = new FormData();
        uploadData.append('file', item.file);
        const uploadResult = await uploadImagen(uploadData);
        if ('error' in uploadResult) {
          setError(`Error subiendo galería: ${uploadResult.error}`);
          return;
        }
        newGalleryUrls.push(uploadResult.url);
      }

      const data = {
        titulo: formData.get('titulo') as string,
        categoria: formData.get('categoria') as string,
        ubicacion: formData.get('ubicacion') as string,
        descripcion: formData.get('descripcion') as string,
        descripcion_larga: formData.get('descripcion_larga') as string,
        imagen_principal: imagenUrl,
        galeria: [...galleryUrls, ...newGalleryUrls],
        puntos_clave: puntos.filter((p) => p.trim() !== ''),
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

          {/* Puntos Clave */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Puntos Clave
              </label>
              <button
                type="button"
                onClick={() => setPuntos((prev) => [...prev, ''])}
                className="text-xs text-[var(--primary)] font-bold hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Agregar punto
              </button>
            </div>
            <div className="space-y-2">
              {puntos.map((punto, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[var(--primary)] text-base shrink-0">check_circle</span>
                  <input
                    type="text"
                    value={punto}
                    onChange={(e) =>
                      setPuntos((prev) =>
                        prev.map((p, i) => (i === idx ? e.target.value : p))
                      )
                    }
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder="Ej: Ejecución bajo normas de seguridad industrial."
                  />
                  <button
                    type="button"
                    onClick={() => setPuntos((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                    aria-label="Eliminar punto"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              ))}
              {puntos.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">
                  Sin puntos clave — haz clic en &quot;Agregar punto&quot; para añadir.
                </p>
              )}
            </div>
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

          {/* Galería */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Galería de Imágenes (Opcional)
            </label>
            <div className="space-y-3">
              <input
                ref={galleryRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryChange}
                className="hidden"
              />
              <button
                type="button"
                disabled={compressing}
                onClick={() => galleryRef.current?.click()}
                className="flex items-center gap-2 border-2 border-dashed border-gray-300 hover:border-[var(--primary)] rounded-lg px-4 py-3 text-sm text-gray-500 hover:text-gray-700 transition-all w-full justify-center disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-xl">
                  {compressing ? 'hourglass_empty' : 'collections'}
                </span>
                {compressing ? 'Optimizando galería...' : 'Agregar fotos a la galería'}
              </button>

              {/* Previews de Galería */}
              {(galleryUrls.length > 0 || galleryFiles.length > 0) && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                  {galleryUrls.map((url, i) => (
                    <div key={url} className="relative aspect-square rounded-lg border overflow-hidden group">
                      <img src={url} alt={`Galería ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setGalleryUrls(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                  {galleryFiles.map((item, i) => (
                    <div key={i} className="relative aspect-square rounded-lg border overflow-hidden group">
                      <img src={item.preview} alt={`Nueva ${i}`} className="w-full h-full object-cover opacity-80" />
                      <button
                        type="button"
                        onClick={() => setGalleryFiles(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
