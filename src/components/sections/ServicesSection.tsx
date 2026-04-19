export default function ServicesSection() {
  return (
    <section className="py-16 md:py-24 bg-white" id="servicios">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark-slate)] mb-4">
            Nuestros Servicios Principales
          </h2>
          <div className="w-20 h-1.5 bg-[var(--primary)] mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          <article className="group">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--slate-bg)] text-[var(--black)] group-hover:bg-[var(--primary)] transition-all duration-300">
              <span className="material-symbols-outlined text-4xl md:text-5xl">water_damage</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[var(--dark-slate)]">Alcantarillado</h3>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto text-sm md:text-base">
              Construcción y mantenimiento de redes de alcantarillado, garantizando una gestión
              eficiente de aguas residuales y pluviales.
            </p>
          </article>
          <article className="group">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--slate-bg)] text-[var(--black)] group-hover:bg-[var(--primary)] transition-all duration-300">
              <span className="material-symbols-outlined text-4xl md:text-5xl">settings_input_component</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[var(--dark-slate)]">Salas de Bombas</h3>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto text-sm md:text-base">
              Instalación y mantenimiento preventivo de sistemas de bombeo industrial para edificios
              corporativos y residenciales.
            </p>
          </article>
          <article className="group">
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--slate-bg)] text-[var(--black)] group-hover:bg-[var(--primary)] transition-all duration-300">
              <span className="material-symbols-outlined text-4xl md:text-5xl">plumbing</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[var(--dark-slate)]">Gasfitería Integral</h3>
            <p className="text-gray-600 leading-relaxed max-w-xs mx-auto text-sm md:text-base">
              Soluciones expertas en redes de agua potable, calderas y climatización con materiales
              de primera línea.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
