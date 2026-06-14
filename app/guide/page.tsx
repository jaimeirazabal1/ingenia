'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import { ArrowRight, Sparkles, Key, Check, Database, Shield, BookOpen, Code, Languages, BarChart3, Cpu } from 'lucide-react'

const steps = [
  {
    title: 'Consigue tu API Key',
    icon: Key,
    color: '#6c5ce7',
    detail: 'Necesitas una API key de cualquier proveedor compatible. Puedes usar OpenAI, Anthropic Claude, o la API gratuita de OpenCode (zen):',
    links: [
      { url: 'https://opencode.ai', label: 'OpenCode Zen (gratis, recomendado)' },
      { url: 'https://platform.openai.com/api-keys', label: 'OpenAI API Key' },
      { url: 'https://console.anthropic.com', label: 'Anthropic Claude' },
    ],
    tip: 'Ve a cualquier módulo, abre el panel inferior de configuración del modelo, pega tu key y selecciona el proveedor.',
  },
  {
    title: 'Elige un Módulo',
    icon: Sparkles,
    color: '#00cec9',
    detail: 'Cada módulo resuelve un problema específico. Elige el que necesites:',
    modules: [
      { id: 'architect', label: 'Arquitectura', icon: '🏗️', desc: 'Genera ADRs, matrices de trade-offs, revisa arquitecturas' },
      { id: 'context-engineer', label: 'Context Engineering', icon: '⚡', desc: 'Crea prompts profundos con 9 templates predefinidos' },
      { id: 'code-reviewer', label: 'Code Review', icon: '🔍', desc: 'Audita código con checklist OWASP + IA' },
      { id: 'security-shield', label: 'Seguridad', icon: '🛡️', desc: 'Analiza vulnerabilidades, compliance, threat modeling' },
      { id: 'translator', label: 'Traductor Técnico', icon: '💬', desc: 'Traduce entre lenguaje técnico y negocio' },
      { id: 'fundamentals-lab', label: 'Fundamentos', icon: '📚', desc: 'Practica CS, algoritmos, trade-offs técnicos' },
      { id: 'observability-hub', label: 'Observabilidad', icon: '📊', desc: 'Configura OTEL, dashboards, SLOs, runbooks' },
    ],
  },
  {
    title: 'Usa los Presets Rápidos',
    icon: Cpu,
    color: '#fdcb6e',
    detail: 'En cada módulo hay escenarios predefinidos. Solo da clic en uno y los campos se llenan solos. Luego presiona "Generar" y listo.',
    tip: '¿No sabes qué escribir? Los presets están diseñados para cubrir los casos más comunes. Es la forma más rápida de obtener resultados.',
  },
  {
    title: 'Genera y Usa el Resultado',
    icon: Database,
    color: '#e17055',
    detail: 'La IA generará tu documento, análisis o prompt. Puedes copiarlo al portapapeles, descargarlo como .md, o iterar ajustando los parámetros.',
    tip: 'Todo tu historial se guarda automáticamente. Puedes volver a resultados anteriores cuando quieras.',
  },
]

const quickStarts = [
  { icon: '🏗️', label: 'Genera un ADR', desc: 'Documenta una decisión arquitectónica', route: '/architect', preset: 'adr:kafka' },
  { icon: '⚡', label: 'Crea un Prompt', desc: 'Context Engineering para backend API', route: '/context-engineer', preset: 'backend-api' },
  { icon: '🔍', label: 'Audita Código', desc: 'Code Review con OWASP checklist', route: '/code-reviewer', preset: 'express-api' },
  { icon: '🛡️', label: 'Escanea Seguridad', desc: 'Threat modeling para app de pagos', route: '/security-shield', preset: 'pagos' },
  { icon: '💬', label: 'Traduce a Business', desc: 'Convierte técnico a ejecutivo', route: '/translator', preset: 'tech-to-biz' },
  { icon: '📚', label: 'Aprende un Trade-off', desc: 'Cache algorithms (LRU vs LFU)', route: '/fundamentals-lab', preset: 'cache' },
  { icon: '📊', label: 'Crea un Dashboard', desc: 'SLO dashboard para API', route: '/observability-hub', preset: 'dashboard' },
]

export default function GuidePage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--color-architect) 0%, var(--color-security) 100%)',
          padding: '2.5rem 2rem', color: 'white',
        }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Cómo Usar InGenIA</h1>
          <p style={{ opacity: 0.85, fontSize: '0.9rem', maxWidth: 600 }}>
            Guía interactiva para sacarle el máximo partido a la plataforma en segundos, sin complicaciones.
          </p>
        </div>

        <div style={{ padding: '1.5rem 2rem', maxWidth: 900 }}>
          {/* Steps */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>📋 Pasos Rápidos</h2>
            {steps.map((step, i) => {
              const Icon = step.icon
              const isActive = activeStep === i
              return (
                <div key={i} style={{
                  marginBottom: '0.75rem', borderRadius: '0.75rem', overflow: 'hidden',
                  border: isActive ? `1px solid ${step.color}` : '1px solid var(--border)',
                  transition: 'all 0.2s',
                }}>
                  <div onClick={() => setActiveStep(isActive ? -1 : i)} style={{
                    padding: '0.75rem 1rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    background: isActive ? 'rgba(108,92,231,0.05)' : 'transparent',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', flexShrink: 0,
                    }}><Icon size={16} color="white" /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{step.title}</div>
                    </div>
                    <ArrowRight size={14} style={{
                      transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s', color: 'var(--text-secondary)',
                    }} />
                  </div>
                  {isActive && (
                    <div style={{ padding: '0 1rem 1rem 1rem', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{step.detail}</p>
                      {step.links && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.75rem' }}>
                          {step.links.map((l, j) => (
                            <a key={j} href={l.url} target="_blank" rel="noopener noreferrer"
                              style={{ color: 'var(--accent-light)', textDecoration: 'underline', fontSize: '0.8rem' }}>
                              → {l.label}
                            </a>
                          ))}
                        </div>
                      )}
                      {step.modules && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          {step.modules.map(m => (
                            <button key={m.id} onClick={() => router.push(`/${m.id}`)} style={{
                              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem',
                              borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                              cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', fontSize: '0.75rem',
                              transition: 'all 0.15s',
                            }}>
                              <span style={{ fontSize: '1rem' }}>{m.icon}</span>
                              <div>
                                <div style={{ fontWeight: 600 }}>{m.label}</div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{m.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {step.tip && (
                        <div style={{
                          padding: '0.5rem 0.75rem', borderRadius: '0.5rem',
                          background: 'rgba(253,203,110,0.1)', border: '1px solid rgba(253,203,110,0.2)',
                          fontSize: '0.75rem', color: '#fdcb6e',
                        }}>
                          💡 {step.tip}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick Start buttons */}
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>🚀 Acceso Rápido</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {quickStarts.map(q => (
                <button key={q.route} onClick={() => router.push(q.route)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
                    borderRadius: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    color: 'var(--text-primary)',
                  }}>
                  <span style={{ fontSize: '1.5rem' }}>{q.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{q.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{q.desc}</div>
                  </div>
                  <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--text-secondary)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '2rem', padding: '1rem', borderRadius: '0.75rem',
            background: 'rgba(108,92,231,0.05)', border: '1px solid rgba(108,92,231,0.15)',
            textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)',
          }}>
            <p>💡 <strong>Tip:</strong> En cada módulo hay <strong>presets rápidos</strong> con escenarios predefinidos. Solo da clic y los campos se llenan solos.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
