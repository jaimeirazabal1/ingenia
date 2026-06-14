'use client'

import { ReactNode } from 'react'

interface Props {
  title: string
  subtitle: string
  icon: string
  color: string
  badge: string
  children: ReactNode
}

export default function ModuleLayout({ title, subtitle, icon, color, badge, children }: Props) {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <div className="animate-in" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '1.5rem' }}>{icon}</div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>{title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>{subtitle}</p>
          </div>
          <span className="tag" style={{ marginLeft: 'auto', background: `${color}20`, color }}>{badge}</span>
        </div>
      </div>
      {children}
    </div>
  )
}
