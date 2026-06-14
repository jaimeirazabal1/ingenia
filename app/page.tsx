'use client'

import { useRouter } from 'next/navigation'
import Sidebar from '../components/Sidebar'

const modules = [
  {
    id: 'architect', icon: '🏗️', title: 'Arquitectura', color: '#6c5ce7',
    desc: 'Diseño de sistemas, ADRs, trade-offs y diagramas C4',
    points: ['Generar ADRs con contexto', 'Evaluar trade-offs arquitectónicos', 'Identificar riesgos y antipatrones'],
  },
  {
    id: 'context-engineer', icon: '⚡', title: 'Context Engineering', color: '#00cec9',
    desc: 'Prompts profundos para orquestar IA con criterio',
    points: ['9 templates especializados', 'Contexto arquitectónico completo', 'Exportar CLAUDE.md'],
  },
  {
    id: 'code-reviewer', icon: '🔍', title: 'Code Review IA', color: '#fdcb6e',
    desc: 'Auditoría de código generado por IA con checklist OWASP',
    points: ['Detección de code smells', 'Checklist OWASP Top 10', 'Review estructurada por severidad'],
  },
  {
    id: 'security-shield', icon: '🛡️', title: 'Seguridad', color: '#ff6b6b',
    desc: 'Escáner de vulnerabilidades, compliance y secrets',
    points: ['Análisis de vulnerabilidades', 'Detección de secrets', 'Cumplimiento PCI/GDPR/SOC2'],
  },
  {
    id: 'translator', icon: '💬', title: 'Traductor Técnico<>Negocio', color: '#a29bfe',
    desc: 'Comunicación entre ingeniería y stakeholders',
    points: ['Traducir requisitos técnicos', 'Executive summaries', 'Documentar trade-offs'],
  },
  {
    id: 'fundamentals-lab', icon: '📚', title: 'Fundamentos CS', color: '#00b894',
    desc: 'Algoritmos, sistemas distribuidos, BD, redes y SO',
    points: ['Explicaciones con IA', 'Conexión con errores típicos de IA', 'Ejercicios prácticos'],
  },
  {
    id: 'observability-hub', icon: '📊', title: 'Observabilidad', color: '#0984e3',
    desc: 'OpenTelemetry, dashboards, alertas, SLOs y runbooks',
    points: ['Configs de OpenTelemetry', 'Dashboards Grafana/Datadog', 'Reglas de alerta y runbooks'],
  },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <div style={{ padding: '2rem 2.5rem', maxWidth: 1100 }}>
          <div className="animate-in" style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              InGenIA
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 600 }}>
              Las 7 habilidades críticas del desarrollador en la era de la IA. Una plataforma para construirlas.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {modules.map((m, i) => (
              <div key={m.id} className="glass animate-in" style={{
                padding: '1.25rem 1.5rem', borderRadius: '0.75rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1.25rem',
                animationDelay: `${i * 50}ms`,
              }} onClick={() => router.push(`/${m.id}`)}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: `${m.color}20`, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
                }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>{m.title}</h2>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.5rem 0' }}>{m.desc}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {m.points.map(p => (
                      <span key={p} className="tag" style={{ fontSize: '0.7rem' }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }}>→</div>
              </div>
            ))}
          </div>

          <footer style={{ marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textAlign: 'center', padding: '1rem 0' }}>
            InGenIA — Las 7 habilidades que separan al desarrollador que usa IA del que la orquesta con criterio.
          </footer>
        </div>
      </main>
    </div>
  )
}
