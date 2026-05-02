import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ProjectsSection from "@/components/sections/ProjectsSection";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Plumber Servicios SPA",
    "alternateName": ["Plumber Servicios", "Plumber Servicios cl", "plumberservicios.cl"],
    "description": "Especialistas en ingeniería hidráulica, alcantarillado, salas de bombas y gasfitería industrial en Los Ángeles, Región del Biobío, Chile.",
    "url": "https://plumberservicios.cl",
    "logo": "https://plumberservicios.cl/favicon.png",
    "image": "https://plumberservicios.cl/og-image.png",
    "telephone": "+56936256733",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Temuco 467",
      "addressLocality": "Los Ángeles",
      "addressRegion": "Biobío",
      "addressCountry": "CL",
      "postalCode": "3800000"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -37.4694,
      "longitude": -72.3528
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "serviceArea": {
      "@type": "AdministrativeArea",
      "name": "Región del Biobío, Chile"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de Ingeniería Hidráulica",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Alcantarillado",
            "description": "Construcción y mantenimiento de redes de alcantarillado"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Salas de Bombas",
            "description": "Instalación y mantenimiento de sistemas de bombeo industrial"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Gasfitería Integral",
            "description": "Redes de agua potable, calderas y climatización"
          }
        }
      ]
    },
    "sameAs": []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProjectsSection />
      </main>
    </>
  );
}
