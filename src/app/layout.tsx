import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Full Stack Developer | Portfólio Profissional",
    template: "%s | IsacFSC",
  },
  description:
    "Desenvolvedor Full Stack especializado em Next.js, TypeScript, React Native e PostgreSQL. Transformando ideias em produtos digitais de qualidade com segurança e performance.",
  keywords: [
    "full stack developer",
    "next.js",
    "react",
    "typescript",
    "node.js",
    "postgresql",
    "desenvolvedor",
    "web development",
  ],
  authors: [{ name: "IsacFSC" }],
  creator: "IsacFSC",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://seu-dominio.com",
    siteName: "IsacFSC - Full Stack Developer",
    title: "Full Stack Developer | Portfólio Profissional",
    description:
      "Projetos profissionais desenvolvidos com as melhores práticas de código e segurança.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Full Stack Developer Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Stack Developer | Portfólio Profissional",
    description:
      "Desenvolvedor Full Stack com expertise em Next.js, React e Node.js",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=630&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "seu-google-site-verification-code",
  },
  alternates: {
    canonical: "https://seu-dominio.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://seu-dominio.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
