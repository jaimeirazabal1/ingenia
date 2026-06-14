'use client'

import { useState, useEffect, useCallback } from 'react'
import Sidebar from '../../components/Sidebar'
import { Trash2, ChevronDown, ChevronUp, Copy, Clock } from 'lucide-react'
import { useToast } from '../../components/Toast'
import LoadingSpinner from '../../components/LoadingSpinner'

interface HistoryEntry {
  id: string
  module: string
  provider: string | null
  model: string | null
  prompt: string
  system_prompt: string | null
  result: string | null
  tokens_used: number | null
  created_at: string
}

const MODULE_NAMES: Record<string, { label: string; icon: string; color: string }> = {
  architect: { label: 'Arquitectura', icon: '🏗️', color: '#6c5ce7' },
  'context-engineer': { label: 'Context Engineering', icon: '⚡', color: '#00cec9' },
  'code-reviewer': { label: 'Code Review', icon: '🔍', color: '#fdcb6e' },
  'security-shield': { label: 'Seguridad', icon: '🛡️', color: '#ff6b6b' },
  translator: { label: 'Traductor Técnico', icon: '💬', color: '#a29bfe' },
  'fundamentals-lab': { label: 'Fundamentos', icon: '📚', color: '#00b894' },
  'observability-hub': { label: 'Observabilidad', icon: '📊', color: '#0984e3' },
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filterModule, setFilterModule] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const { toast } = useToast()

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const url = filterModule ? `/api/history?module=${filterModule}&limit=200` : '/api/history?limit=200'
      const res = await fetch(url)
      const data = await res.json()
      setEntries(data)
    } catch {
      setEntries([])
      toast('Error al cargar el historial', 'error')
    }
    setLoading(false)
  }, [filterModule])

  useEffect(() => { loadHistory() }, [loadHistory])

  const handleDelete = async (id: string) => {
    await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
    setEntries(prev => prev.filter(e => e.id !== id))
    toast('Entrada eliminada', 'success')
  }

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast(`${label} copiado al portapapeles`, 'success')
  }

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'Z')
    return d.toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const modules = Object.entries(MODULE_NAMES)

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
          padding: '2rem 2rem', color: 'white',
        }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Historial</h1>
          <p style={{ opacity: 0.85, fontSize: '0.9rem' }}>
            Todos tus prompts y resultados generados, guardados automáticamente.
          </p>
        </div>

        <div style={{ padding: '1.5rem 2rem', maxWidth: 900 }}>
          {/* Filter tabs */}
          <div style={{
            display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1.5rem',
          }}>
            <button onClick={() => setFilterModule(null)} style={{
              padding: '0.35rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border)',
              background: filterModule === null ? 'var(--accent-gradient)' : 'var(--bg-card)',
              color: filterModule === null ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500,
              transition: 'all 0.15s',
            }}>
              Todas
            </button>
            {modules.map(([id, m]) => (
              <button key={id} onClick={() => setFilterModule(id)} style={{
                padding: '0.35rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border)',
                background: filterModule === id ? m.color : 'var(--bg-card)',
                color: filterModule === id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500,
                transition: 'all 0.15s',
              }}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>

          {loading && <LoadingSpinner text="Cargando historial..." />}

          {/* Empty state */}
          {!loading && entries.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)',
              border: '1px dashed var(--border)', borderRadius: '0.75rem',
            }}>
              <Clock size={32} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>No hay historial todavía</p>
              <p style={{ fontSize: '0.75rem' }}>Los prompts y resultados se guardan automáticamente al generar en cualquier módulo.</p>
            </div>
          )}

          {/* Entries */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {entries.map(entry => {
              const mod = MODULE_NAMES[entry.module] || { label: entry.module, icon: '📄', color: '#636e72' }
              const isExpanded = expanded.has(entry.id)

              return (
                <div key={entry.id} className="glass" style={{
                  borderRadius: '0.75rem', overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  {/* Header */}
                  <div onClick={() => toggleExpand(entry.id)} style={{
                    padding: '0.75rem 1rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: `${mod.color}20`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem', flexShrink: 0,
                    }}>{mod.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{mod.label}</span>
                        {entry.provider && (
                          <span className="tag" style={{ fontSize: '0.6rem', opacity: 0.6 }}>{entry.provider}{entry.model ? ` · ${entry.model}` : ''}</span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '0.75rem', color: 'var(--text-secondary)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        marginTop: '0.125rem',
                      }}>
                        {entry.prompt.slice(0, 120)}{entry.prompt.length > 120 ? '...' : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatDate(entry.created_at)}
                    </div>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '1rem' }}>
                      {/* System Prompt */}
                      {entry.system_prompt && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            System Prompt
                          </div>
                          <pre style={{
                            fontSize: '0.75rem', background: 'var(--bg-card)', padding: '0.75rem',
                            borderRadius: '0.5rem', overflow: 'auto', maxHeight: 200,
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            margin: 0,
                          }}>{entry.system_prompt}</pre>
                        </div>
                      )}

                      {/* Prompt */}
                      <div style={{ marginBottom: entry.result ? '0.75rem' : 0 }}>
                        <div style={{
                          fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)',
                          marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                        }}>
                          <span>Prompt</span>
                          <button onClick={() => handleCopy(entry.prompt, 'Prompt')} style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem',
                            fontSize: '0.65rem',
                          }}>
                            <Copy size={12} />
                            Copiar
                          </button>
                        </div>
                        <pre style={{
                          fontSize: '0.75rem', background: 'var(--bg-card)', padding: '0.75rem',
                          borderRadius: '0.5rem', overflow: 'auto', maxHeight: 300,
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                          margin: 0,
                        }}>{entry.prompt}</pre>
                      </div>

                      {/* Result */}
                      {entry.result && (
                        <div>
                          <div style={{
                            fontSize: '0.7rem', fontWeight: 600, color: '#00b894',
                            marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                          }}>
                            <span>Resultado</span>
                            <button onClick={() => handleCopy(entry.result!, 'Resultado')} style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              color: 'var(--text-secondary)',
                              padding: 0, display: 'flex', alignItems: 'center', gap: '0.25rem',
                              fontSize: '0.65rem',
                            }}>
                              <Copy size={12} />
                              Copiar
                            </button>
                          </div>
                          <pre style={{
                            fontSize: '0.75rem', background: 'rgba(0,184,148,0.05)',
                            border: '1px solid rgba(0,184,148,0.15)',
                            padding: '0.75rem', borderRadius: '0.5rem',
                            overflow: 'auto', maxHeight: 400,
                            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                            margin: 0,
                          }}>{entry.result}</pre>
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{
                        marginTop: '0.75rem', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)',
                      }}>
                        <div>
                          {entry.tokens_used && <span>Tokens: {entry.tokens_used.toLocaleString()}</span>}
                        </div>
                        <button onClick={() => handleDelete(entry.id)} style={{
                          display: 'flex', alignItems: 'center', gap: '0.25rem',
                          padding: '0.25rem 0.5rem', borderRadius: '0.375rem',
                          border: '1px solid rgba(255,107,107,0.3)', cursor: 'pointer',
                          background: 'rgba(255,107,107,0.05)', color: '#ff6b6b',
                          fontSize: '0.7rem', transition: 'all 0.15s',
                        }}>
                          <Trash2 size={12} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
