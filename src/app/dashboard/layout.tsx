import Link from 'next/link';
import { logout } from '@/app/actions/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--slate-bg)]">
      {/* Sidebar — desktop: columna lateral | mobile: barra superior */}
      <aside className="w-full md:w-64 bg-[var(--dark-slate)] text-white flex flex-row md:flex-col md:shrink-0">
        {/* Brand */}
        <div className="px-5 py-4 md:px-6 md:py-6 md:border-b md:border-white/10 flex items-center md:block">
          <Link href="/dashboard">
            <p className="industrial-font text-lg md:text-xl text-[var(--primary)] leading-none">Plumber</p>
            <p className="text-[9px] md:text-[10px] text-gray-400 tracking-widest uppercase hidden md:block">Panel Admin</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-row md:flex-col flex-1 px-2 md:px-4 py-2 md:py-6 gap-1 overflow-x-auto md:overflow-x-visible">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg md:text-xl">dashboard</span>
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/proyectos"
            target="_blank"
            className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg md:text-xl">open_in_new</span>
            <span className="hidden sm:inline">Ver sitio</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="px-2 md:px-4 py-2 md:py-6 md:border-t md:border-white/10 ml-auto md:ml-0">
          <form action={logout}>
            <button
              type="submit"
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-xs md:text-sm font-medium text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg md:text-xl">logout</span>
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
