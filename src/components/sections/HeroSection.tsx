import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative h-[560px] md:h-[650px] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          alt="Instalaciones industriales"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbxq8My2HT5yQLcKEEMqxG3eVsu2fJDXmBAyrpkIzEj9eH0BAlbIOaaxSo2eC-sMoRHJl7w8EtQykYIcOrNQJdj4NtNK2Db7UwvL3mHSolo-UNGpfJMuUsmN5krQyhLFReOAwqv6nHxFRHWm3TuR4GHn7zZznLkbMVJph5zI8GqLfIjZL5nDXLX_aER43rXwbQZ2rdlLbZOYhSg-x4LUUXXw81gVomY7koCYdkW0Z7-G4DZIuxjDSCBRLeoS2nzCbCh-jnq7VCk35A"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-black/30" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <span className="inline-block px-3 py-1 bg-[var(--primary)] text-[var(--black)] industrial-font text-xs font-bold mb-4">
            Líderes en Ingeniería Hidráulica
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Expertos en Soluciones Hidráulicas de{' '}
            <span className="text-[var(--primary)]">Alta Precisión</span>
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-8 md:mb-10 max-w-xl font-light leading-relaxed">
            Brindamos servicios especializados en alcantarillado, salas de bombas y gasfitería
            industrial con los más altos estándares de calidad en la Octava Región.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="https://wa.me/56936256733?text=Hola,%20me%20gustar%C3%ADa%20solicitar%20un%20presupuesto."
              className="bg-[var(--primary)] text-[var(--black)] px-8 py-3.5 md:px-10 md:py-4 font-bold industrial-font text-base md:text-lg hover:bg-white transition-all shadow-xl text-center"
            >
              Solicitar Presupuesto
            </a>
            <Link
              href="/proyectos"
              className="bg-transparent border-2 border-white text-white px-8 py-3.5 md:px-10 md:py-4 font-bold industrial-font text-base md:text-lg hover:bg-white hover:text-[var(--black)] transition-all text-center"
            >
              Ver Proyectos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
