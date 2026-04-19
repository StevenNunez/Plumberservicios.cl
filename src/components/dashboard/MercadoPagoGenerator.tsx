'use client';

import { useState, useTransition } from 'react';

export default function MercadoPagoGenerator() {
  const [isPending, startTransition] = useTransition();
  const [titulo, setTitulo] = useState('');
  const [monto, setMonto] = useState('');
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLink(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/mercadopago/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo,
            monto: parseFloat(monto),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.init_point) {
          setError(data.error ?? 'No se pudo generar el enlace.');
        } else {
          setLink(data.init_point);
        }
      } catch {
        setError('Error de conexión con Mercado Pago.');
      }
    });
  }

  async function handleCopy() {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#009ee3] rounded-lg flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-white text-xl">payments</span>
        </div>
        <div>
          <h3 className="font-bold text-[var(--dark-slate)]">Generar Enlace de Pago</h3>
          <p className="text-xs text-gray-500">Mercado Pago Checkout Pro</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del servicio
          </label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Instalación gasfitería — Cliente García"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto (CLP)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              $
            </span>
            <input
              type="number"
              required
              min="100"
              step="1"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="150000"
              className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee3]"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#009ee3] hover:bg-[#007ab8] text-white industrial-font font-bold py-3 rounded-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
              Generando...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">link</span>
              Generar Enlace
            </>
          )}
        </button>
      </form>

      {/* Resultado */}
      {link && (
        <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs font-medium text-green-800 mb-2">
            Enlace generado correctamente
          </p>
          <div className="flex gap-2 items-center">
            <input
              readOnly
              value={link}
              className="flex-1 text-xs bg-white border border-green-300 rounded px-3 py-2 text-green-900 truncate"
            />
            <button
              onClick={handleCopy}
              className="shrink-0 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-medium transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-green-700 hover:underline"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Abrir enlace
          </a>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
