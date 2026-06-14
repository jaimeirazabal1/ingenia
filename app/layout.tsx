import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DevForge — Plataforma de Ingeniería de Software Aumentada por IA',
  description: 'Arquitectura, Context Engineering, Code Review, Seguridad, Comunicación, Fundamentos y Observabilidad — todo impulsado por IA.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
