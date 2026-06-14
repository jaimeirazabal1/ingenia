'use client'

import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  return (
    <header className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => router.push('/')}>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.1rem',
          color: 'white',
        }}>DP</div>
        <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>DeepPrompt</span>
      </div>
      <nav style={{ display: 'flex', gap: '0.5rem' }}>
        <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={() => router.push('/')}>
          Inicio
        </button>
        <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }} onClick={() => router.push('/builder')}>
          + Nuevo Prompt
        </button>
      </nav>
    </header>
  )
}
