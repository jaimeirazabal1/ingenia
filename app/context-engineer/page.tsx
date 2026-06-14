'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/Sidebar'
import ModuleLayout from '../../components/ModuleLayout'
import { templates } from '../../lib/templates'
import { generatePrompt } from '../../lib/prompt-generator'
import { improvePrompt } from '../../lib/ai-assistant'
import AiPanel from '../../components/AiPanel'
import { Copy, Download, Sparkles, ArrowRight, Wand2 } from 'lucide-react'

export default function ContextEngineerPage() {
  const router = useRouter()
  const [selectedId, setSelectedId] = useState('backend-api')
  const [values, setValues] = useState<Record<string, any>>({})
  const [result, setResult] = useState('')
  const [toast, setToast] = useState('')
  const [improving, setImproving] = useState(false)

  const template = templates.find(t => t.id === selectedId)

  const handleGenerate = () => {
    if (!template) return
    setResult(generatePrompt(template, values))
  }

  const handleImprove = async () => {
    setImproving(true)
    try {
      const res = await improvePrompt(result)
      setResult(res.suggestion)
      setToast(`✅ Mejoras aplicadas: ${res.improvements.length} cambios`)
    } catch (e: any) {
      setToast(`❌ Error: ${e.message}`)
    }
    setImproving(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setToast('Copiado!')
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <ModuleLayout title="Context Engineering" subtitle="Crea prompts profundos con contexto arquitectónico completo" icon="⚡" color="#00cec9" badge="#2">
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem' }}>
            <div className="glass" style={{ padding: '0.75rem', borderRadius: '0.75rem' }}>
              <h4 style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Templates</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {templates.map(t => (
                  <button key={t.id} onClick={() => { setSelectedId(t.id); setValues({}); setResult('') }} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.5rem',
                    borderRadius: '0.4rem', background: selectedId === t.id ? 'var(--bg-card-hover)' : 'transparent',
                    border: selectedId === t.id ? '1px solid var(--accent)' : '1px solid transparent',
                    color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.75rem',
                    textAlign: 'left', width: '100%',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
              <button className="btn-secondary" style={{ width: '100%', fontSize: '0.7rem', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                onClick={() => router.push('/guide')}>
                ❓ ¿Cómo usar?
              </button>
            </div>

            <div>
              {template && (
                <div className="glass" style={{ padding: '1.25rem', borderRadius: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>{template.name}</h3>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {template.fields.slice(0, 6).map(f => (
                      <div key={f.id}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>
                          {f.label}{f.required && <span style={{ color: 'var(--accent)' }}>*</span>}
                        </label>
                        {f.type === 'textarea' ? (
                          <div>
                            <textarea className="input-field" rows={2} placeholder={f.placeholder}
                              value={values[f.id] || ''} onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))} />
                            {f.suggestions && f.suggestions.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.375rem' }}>
                                {f.suggestions.map(s => (
                                  <button key={s} type="button" onClick={() => setValues(v => ({ ...v, [f.id]: s }))}
                                    style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', border: '1px solid var(--border)', background: 'rgba(108,92,231,0.06)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : f.type === 'select' ? (
                          <select className="input-field" value={values[f.id] || ''}
                            onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}>
                            <option value="">Selecciona...</option>
                            {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                          </select>
                        ) : f.type === 'multiselect' ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {f.options?.map(o => {
                              const sel = (values[f.id] || []).includes(o)
                              return (
                                <button key={o} onClick={() => {
                                  const cur = values[f.id] || []
                                  setValues(v => ({ ...v, [f.id]: sel ? cur.filter((x: string) => x !== o) : [...cur, o] }))
                                }} style={{
                                  padding: '0.2rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem',
                                  border: sel ? '1px solid var(--accent)' : '1px solid var(--border)',
                                  background: sel ? 'rgba(108,92,231,0.15)' : 'transparent',
                                  color: sel ? 'var(--accent-light)' : 'var(--text-secondary)', cursor: 'pointer',
                                }}>{o}</button>
                              )
                            })}
                          </div>
                        ) : (
                          <div>
                            <input className="input-field" type="text" placeholder={f.placeholder}
                              value={values[f.id] || ''} onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))} />
                            {f.suggestions && f.suggestions.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.375rem' }}>
                                {f.suggestions.map(s => (
                                  <button key={s} type="button" onClick={() => setValues(v => ({ ...v, [f.id]: s }))}
                                    style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', border: '1px solid var(--border)', background: 'rgba(108,92,231,0.06)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    onClick={handleGenerate}>
                    <Sparkles size={14} /> Generar Prompt
                  </button>
                  <div style={{ marginTop: '0.75rem' }}>
                    <AiPanel compact />
                  </div>
                </div>
              )}

              {result && (
                <div className="glass animate-in" style={{ marginTop: '1rem', borderRadius: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button className="btn-secondary" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={handleCopy}><Copy size={12} /> Copiar</button>
                    <button className="btn-secondary" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                      onClick={() => { const b = new Blob([result], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'prompt.md'; a.click() }}>
                      <Download size={12} /> .md
                    </button>
                    <button className="btn-primary" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)' }}
                      onClick={handleImprove} disabled={!result || improving}>
                      <Wand2 size={12} /> {improving ? 'Mejorando...' : 'Mejorar Prompt con IA'}
                    </button>
                  </div>
                  <pre style={{ margin: 0, maxHeight: 400, overflow: 'auto', fontSize: '0.75rem' }}><code>{result}</code></pre>
                </div>
              )}
            </div>
          </div>
          {toast && <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: 'var(--bg-card)', border: '1px solid var(--accent)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>{toast}</div>}
        </ModuleLayout>
      </main>
    </div>
  )
}
