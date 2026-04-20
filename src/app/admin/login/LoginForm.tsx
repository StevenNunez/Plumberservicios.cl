'use client';

import { login } from '@/app/actions/auth';
import { useActionState } from 'react';

const initialState = { error: '' };

async function loginAction(_prev: typeof initialState, formData: FormData) {
  const result = await login(formData);
  return result ?? initialState;
}

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-[var(--dark-slate)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="industrial-font text-4xl text-[var(--primary)]">Plumber</h1>
          <p className="text-gray-400 text-sm tracking-widest">PANEL DE ADMINISTRACIÓN</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-[var(--dark-slate)] mb-6">Iniciar sesión</h2>

          <form action={action} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="admin@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[var(--primary)] text-[var(--black)] industrial-font font-bold py-3 rounded-lg hover:bg-[var(--primary-hover)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {pending ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Ingresando...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
