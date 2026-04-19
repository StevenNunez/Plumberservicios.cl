import type { Metadata } from "next";
import { Inter, Oswald, Black_Ops_One } from "next/font/google";
import "./globals.css";
import PublicChrome from "@/components/layout/PublicChrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const blackOps = Black_Ops_One({
  variable: "--font-black-ops",
  weight: "400",
  subsets: ["latin"],
});

const SITE_URL = 'https://plumberservicios.cl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Plumber Servicios SPA | Expertos en Soluciones Hidráulicas en Los Ángeles',
    template: '%s | Plumber Servicios SPA',
  },
  description:
    'Especialistas en ingeniería hidráulica, alcantarillado, redes de incendio y gasfitería industrial en Los Ángeles, Región del Biobío. Calidad que construye confianza.',
  keywords: [
    'gasfitería industrial',
    'alcantarillado',
    'ingeniería hidráulica',
    'Los Ángeles',
    'Biobío',
    'red seca',
    'salas de bombas',
    'construcción residencial',
    'plomería',
    'instalaciones sanitarias',
  ],
  authors: [{ name: 'Plumber Servicios SPA', url: SITE_URL }],
  creator: 'Plumber Servicios SPA',
  openGraph: {
    title: 'Plumber Servicios SPA | Expertos en Soluciones Hidráulicas',
    description:
      'Especialistas en ingeniería hidráulica, alcantarillado y gasfitería en el Biobío. Obras residenciales e industriales en Los Ángeles, Chile.',
    url: SITE_URL,
    siteName: 'Plumber Servicios SPA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Plumber Servicios SPA — Ingeniería Hidráulica en Los Ángeles',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Plumber Servicios SPA | Soluciones Hidráulicas',
    description: 'Especialistas en ingeniería hidráulica y gasfitería industrial en el Biobío.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logopes.png',
    apple: '/logopes.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${oswald.variable} ${blackOps.variable} scroll-smooth antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white min-h-screen font-sans text-slate-700 flex flex-col">
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
