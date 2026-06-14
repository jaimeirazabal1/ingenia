'use client'

import { useState, useEffect } from 'react'
import { loadAiConfig, saveAiConfig, getProviderMeta, type AiConfig, type AiProvider } from '../lib/ai-service'
import { saveApiKeyToDb, loadSavedKeys, deleteSavedKey } from '../lib/api-db'
import { Settings, ChevronDown, Key, Trash2 } from 'lucide-react'

const PROVIDERS: { id: AiProvider; label: string }[] = [
  { id: 'opencode', label: 'OpenCode Zen' },
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'openrouter', label: 'OpenRouter' },
  { id: 'custom', label: 'Custom' },
]

interface Props {
  onConfigChange?: (config: AiConfig) => void
  compact?: boolean
}

export default function AiPanel({ onConfigChange, compact }: Props) {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<AiConfig>(loadAiConfig())
  const [savedKeys, setSavedKeys] = useState<{ id: string; provider: string; label: string | null }[]>([])

  useEffect(() => { saveAiConfig(config); onConfigChange?.(config) }, [config])

  useEffect(() => { if (open) loadSavedKeys().then(setSavedKeys) }, [open])

  const meta = getProviderMeta(config.provider)

  const update = (patch: Partial<AiConfig>) => setConfig(c => ({ ...c, ...patch }))

  const handleKeyChange = (key: string) => {
    update({ apiKey: key })
    if (key.length > 10) saveApiKeyToDb(config.provider, key)
  }

  const handleSelectSavedKey = async (savedId: string) => {
    try {
      const res = await fetch(`/api/keys?id=${savedId}`)
      const data = await res.json()
      if (data.key) {
        update({ apiKey: data.key, provider: data.id.split('-')[0] as AiProvider })
      }
    } catch {}
  }

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <select className="input-field" value={config.provider}
          onChange={e => update({ provider: e.target.value as AiProvider, model: getProviderMeta(e.target.value as AiProvider).defaultModel })}
          style={{ fontSize: '0.7rem', padding: '0.3rem 0.5rem', width: 'auto' }}>
          {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <input className="input-field" type="password" placeholder="API key"
          value={config.apiKey} onChange={e => handleKeyChange(e.target.value)}
          style={{ fontSize: '0.7rem', padding: '0.3rem 0.5rem', minWidth: 180, flex: 1 }} />
        {config.provider === 'custom' && (
          <input className="input-field" type="text" placeholder="https://..."
            value={config.baseUrl || ''} onChange={e => update({ baseUrl: e.target.value })}
            style={{ fontSize: '0.7rem', padding: '0.3rem 0.5rem', minWidth: 200 }} />
        )}
      </div>
    )
  }

  return (
    <div className="glass" style={{ borderRadius: '0.75rem', overflow: 'hidden', marginBottom: '1rem' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem',
      }}>
        <Settings size={14} />
        <span style={{ flex: 1, textAlign: 'left' }}>Configuración del Modelo</span>
        {config.apiKey ? <span style={{ color: 'var(--accent)', fontSize: '0.7rem' }}>✓ {config.provider}</span> : <span style={{ color: 'var(--danger)', fontSize: '0.7rem' }}>Sin API key</span>}
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : '', transition: 'transform 0.15s' }} />
      </button>
      {open && (
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Provider</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {PROVIDERS.map(p => (
                <button key={p.id} onClick={() => update({ provider: p.id, model: getProviderMeta(p.id).defaultModel })} style={{
                  padding: '0.3rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.7rem', cursor: 'pointer',
                  border: config.provider === p.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                  background: config.provider === p.id ? 'rgba(108,92,231,0.15)' : 'transparent',
                  color: config.provider === p.id ? 'var(--accent-light)' : 'var(--text-secondary)',
                }}>{p.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>API Key</label>
            <input className="input-field" type="password"
              placeholder={config.provider === 'opencode' ? 'sk-zC...' : config.provider === 'anthropic' ? 'sk-ant-...' : 'sk-...'}
              value={config.apiKey} onChange={e => handleKeyChange(e.target.value)} />
          </div>

          {savedKeys.length > 0 && (
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Keys guardadas</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {savedKeys.map(k => (
                  <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.5rem', borderRadius: '0.4rem', border: '1px solid var(--border)', fontSize: '0.7rem' }}>
                    <Key size={12} />
                    <span style={{ flex: 1 }}>{k.provider} — {k.label || k.id.slice(0, 16)}</span>
                    <button onClick={() => handleSelectSavedKey(k.id)} style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', border: '1px solid var(--accent)', borderRadius: '0.3rem', background: 'transparent', color: 'var(--accent-light)', cursor: 'pointer' }}>Usar</button>
                    <button onClick={() => deleteSavedKey(k.id).then(() => loadSavedKeys().then(setSavedKeys))} style={{ padding: '0.15rem 0.3rem', border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.7rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Modelo</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select className="input-field" value={config.model} onChange={e => update({ model: e.target.value })}
                style={{ flex: 1 }}>
                {meta.models.length > 0 ? meta.models.map(m => (
                  <option key={m} value={m}>{m}</option>
                )) : (
                  <option value="">Custom — escribe abajo</option>
                )}
              </select>
              {(!meta.models.includes(config.model) || config.provider === 'custom') && (
                <input className="input-field" type="text" placeholder="Model ID"
                  value={config.model} onChange={e => update({ model: e.target.value })}
                  style={{ flex: 1 }} />
              )}
            </div>
          </div>

          {config.provider === 'custom' && (
            <div>
              <label style={{ fontSize: '0.7rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block' }}>Base URL (opcional)</label>
              <input className="input-field" type="text" placeholder="https://tu-api.com/v1/chat/completions"
                value={config.baseUrl || ''} onChange={e => update({ baseUrl: e.target.value })} />
            </div>
          )}

          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
            API keys guardadas en base de datos (encriptadas). Preferencia de modelo en localStorage.
          </div>
        </div>
      )}
    </div>
  )
}
