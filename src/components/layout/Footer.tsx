import Link from 'next/link';
import InteractiveLogo from '@/components/ui/InteractiveLogo';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#111111] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
          {/* Logo + descripción */}
          <div>
            <div className="mb-6">
              <img
                alt="Logo Plumber Servicios SPA"
                className="h-auto w-32 object-contain"
                src="/logo.png"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Especialistas en ingeniería hidráulica y servicios de construcción con base en
              Los Ángeles, Chile. Calidad que construye confianza.
            </p>
            <div className="flex gap-4">
              <Link
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--primary)] hover:text-[var(--black)] transition-colors"
                href="#"
              >
                <span className="material-symbols-outlined text-sm">public</span>
              </Link>
              <a
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[var(--primary)] hover:text-[var(--black)] transition-colors"
                href="mailto:contacto@plumberservicios.cl"
              >
                <span className="material-symbols-outlined text-sm">mail</span>
              </a>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[var(--primary)] px-3">
              Ubicación
            </h4>
            <a
              href="https://www.google.com/maps?q=Temuco+467,+Los+Angeles,+Chile"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors mb-4 group"
            >
              <span className="material-symbols-outlined text-[var(--primary)] shrink-0">location_on</span>
              <p className="text-sm group-hover:underline">
                Temuco 467, Los Ángeles<br />
                Región del Biobío, Chile
              </p>
            </a>
            <div className="w-full h-32 rounded-md overflow-hidden border border-gray-800 opacity-90 hover:opacity-100 transition-opacity">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=Temuco%20467,%20Los%20Angeles,%20Chile&t=&z=15&ie=UTF8&iwloc=&output=embed"
              ></iframe>
            </div>
          </div>

          {/* Equipo */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[var(--primary)] px-3">
              Nuestro Equipo
            </h4>
            <ul className="space-y-5 text-sm">
              <li>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <span className="material-symbols-outlined text-[var(--primary)] text-sm shrink-0">person</span>
                  <span>Patricio Chávez</span>
                </div>
                <a
                  className="text-white hover:text-[var(--primary)] transition-colors ml-6 block"
                  href="tel:+56952235696"
                >
                  +56 9 5223 5696
                </a>
              </li>
              <li>
                <div className="flex items-center gap-2 text-gray-400 mb-1">
                  <span className="material-symbols-outlined text-[var(--primary)] text-sm shrink-0">person</span>
                  <span>Rafael Ward</span>
                </div>
                <a
                  className="text-white hover:text-[var(--primary)] transition-colors ml-6 block"
                  href="tel:+56999217453"
                >
                  +56 9 9921 7453
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[var(--primary)] px-3">
              Atención Inmediata
            </h4>
            <a
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-md font-bold industrial-font hover:bg-white hover:text-[#25D366] transition-all w-full justify-center text-sm"
              href="https://wa.me/56952235696?text=Hola,%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n/presupuesto.%20Vengo%20desde%20https://plumberservicios.cl"
            >
              <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-2.32 0-4.525.903-6.163 2.541-3.398 3.398-3.398 8.929 0 12.327l1.044 1.044L6 23.327l1.243-1.114 1.044 1.044c3.398 3.398 8.929 3.398 12.327 0 1.638-1.638 2.541-3.843 2.541-6.163 0-2.32-.903-4.525-2.541-6.163-1.638-1.638-3.843-2.541-6.163-2.541zM17.13 18.04c-.244.686-1.42 1.33-1.956 1.411-.48.072-.947.118-2.61-.537-2.128-.84-3.504-3.003-3.61-3.144-.106-.141-.861-1.144-.861-2.18s.537-1.547.728-1.742c.191-.195.422-.244.562-.244.14 0 .28.001.403.007.131.006.306-.05.478.361.178.423.61 1.488.663 1.597.053.109.088.236.015.38-.073.144-.109.236-.217.362-.109.127-.23.284-.328.384-.109.112-.224.234-.097.452.127.218.566.934 1.214 1.51.834.743 1.54 1.036 1.761 1.139.221.103.351.088.483-.062.132-.15.562-.654.713-.878.151-.224.301-.188.508-.112.207.076 1.314.619 1.54.733.227.114.378.172.433.266.055.094.055.545-.189 1.231z" />
              </svg>
              CONTACTO WHATSAPP
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-gray-500">
            <span>© 2026 Plumber Servicios SPA. Todos los derechos reservados.</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              Desarrollado por
              <a href="https://www.teolabs.app" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <InteractiveLogo variant="footer-small" className="text-[14px]" />
              </a>
              ®
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
