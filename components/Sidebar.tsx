'use client'

import { useRouter, usePathname } from 'next/navigation'

const modules = [
  { id: 'architect', label: 'Arquitectura', color: 'var(--color-architect)', icon: '🏗️' },
  { id: 'context-engineer', label: 'Context Engineering', color: 'var(--color-context)', icon: '⚡' },
  { id: 'code-reviewer', label: 'Code Review', color: 'var(--color-review)', icon: '🔍' },
  { id: 'security-shield', label: 'Seguridad', color: 'var(--color-security)', icon: '🛡️' },
  { id: 'translator', label: 'Traductor Técnico', color: 'var(--color-translator)', icon: '💬' },
  { id: 'fundamentals-lab', label: 'Fundamentos', color: 'var(--color-fundamentals)', icon: '📚' },
  { id: 'observability-hub', label: 'Observabilidad', color: 'var(--color-observability)', icon: '📊' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 40,
    }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}
        onClick={() => router.push('/')}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent-gradient)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '0.9rem', color: 'white',
        }}>D</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>DevForge</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>AI-Augmented Engineering</div>
        </div>
      </div>

      <div style={{ padding: '0.5rem 0.75rem 0.25rem' }}>
        <button onClick={() => router.push('/guide')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 0.6rem', borderRadius: '0.5rem', width: '100%',
          border: '1px dashed var(--border)', cursor: 'pointer',
          background: 'rgba(108,92,231,0.05)', color: 'var(--accent-light)',
          fontSize: '0.75rem', textAlign: 'left', transition: 'all 0.15s',
        }}>
          <span>❓</span>
          <span>¿Cómo usar DevForge?</span>
        </button>
      </div>
      <nav style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
        {modules.map(m => {
          const isActive = pathname === `/${m.id}`
          return (
            <button key={m.id} onClick={() => router.push(`/${m.id}`)} style={{
              display: 'flex', alignItems: 'center', gap: '0.625rem',
              padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
              background: isActive ? 'var(--bg-card-hover)' : 'transparent',
              border: 'none', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.8rem', textAlign: 'left', width: '100%',
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: '1rem' }}>{m.icon}</span>
              <span>{m.label}</span>
              {isActive && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: m.color }} />}
            </button>
          )
        })}
      </nav>

      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', fontSize: '0.7rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
        DevForge v1.0
      </div>
    </aside>
  )
}
