'use client'

import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ModuleLayout from '../../components/ModuleLayout'
import { systemPrompts } from '../../lib/system-prompts'
import { callAi, loadAiConfig } from '../../lib/ai-service'
import { saveAiCallToDb } from '../../lib/api-db'
import AiPanel from '../../components/AiPanel'
import { Copy, Sparkles, ArrowLeftRight } from 'lucide-react'

const modes = [
  { id: 'tech-to-business', label: 'Técnico → Negocio', desc: 'Requisitos técnicos a executive summary' },
  { id: 'business-to-tech', label: 'Negocio → Técnico', desc: 'Requerimientos de negocio a especificación técnica' },
  { id: 'adr-to-exec', label: 'ADR → Executive Summary', desc: 'Resumen ejecutivo de decisiones de arquitectura' },
  { id: 'postmortem', label: 'Postmortem → Lecciones', desc: 'Incidente a documento de lecciones aprendidas' },
  { id: 'api-docs', label: 'Código → Documentación', desc: 'Código fuente a documentación de API' },
]

export default function TranslatorPage() {
  const [mode, setMode] = useState(modes[0].id)
  const [input, setInput] = useState('')
  const [audience, setAudience] = useState('CTO / VP Engineering')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const handleTranslate = async () => {
    const cfg = loadAiConfig()
    if (!cfg.apiKey) { setToast('Configura tu API key en el panel de modelo'); return }
    setLoading(true)
    try {
      const modeLabels: Record<string, string> = {
        'tech-to-business': 'Traduce el siguiente contenido técnico a un lenguaje que un ejecutivo de negocio pueda entender.',
        'business-to-tech': 'Traduce los siguientes requerimientos de negocio a una especificación técnica detallada para el equipo de ingeniería.',
        'adr-to-exec': 'Genera un resumen ejecutivo (1 página) del siguiente ADR, explicando el contexto, decisión, alternativas descartadas e impacto.',
        'postmortem': 'Analiza el siguiente postmortem de incidente y extrae las lecciones aprendidas, acciones concretas y métricas de mejora.',
        'api-docs': 'Genera documentación de API limpia y completa a partir del siguiente código fuente.',
      }
      const prompt = `${modeLabels[mode] || modeLabels['tech-to-business']}

Audiencia objetivo: ${audience}

Contenido a traducir:
${input}

Formato esperado:
- Resumen ejecutivo (máximo 3 párrafos)
- Puntos clave (bullet points)
- Recomendaciones / acciones concretas
- Glosario de términos técnicos usados`

      const result = await callAi(systemPrompts.translator, prompt, cfg)
      setResult(result)
      saveAiCallToDb('translator', prompt, systemPrompts.translator, result, cfg.provider, cfg.model)
    } catch (e: any) { setToast(`Error: ${e.message}`) }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <ModuleLayout title="Traductor Técnico ↔ Negocio" subtitle="Puente entre ingeniería y stakeholders" icon="💬" color="#a29bfe" badge="#5">
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>🔥 Presets rápidos</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Tech→Biz: Pagos', mode: 'tech-to-business', input: 'Implementamos microservicios con Kafka para procesar pagos. Usamos eventos asíncronos para garantizar consistencia eventual. El sistema escala horizontalmente con particionamiento de topics. Tolerancia a fallos mediante replicación con factor 3.', audience: 'CEO / Board' },
                  { label: 'Biz→Tech: Dashboard', mode: 'business-to-tech', input: 'Necesitamos un dashboard en tiempo real que muestre las ventas del día, los usuarios activos y las alertas del sistema. Debe actualizarse cada 5 segundos y ser accesible desde mobile. El equipo de producto necesita filtrar por región y producto.', audience: 'Equipo de desarrollo' },
                  { label: 'ADR→Exec: Cloud', mode: 'adr-to-exec', input: '# ADR-001: Migración a AWS\n## Status: Propuesto\n## Contexto: El datacenter on-premise tiene 85% de utilización y los costes de mantenimiento crecen 20% anual. Se propone migrar a AWS.\n## Decisión: Migrar a EKS con Fargate\n## Opciones: EKS Fargate (coste +35%, ops -60%), ECS (coste +20%, ops -40%), mantener on-prem (coste base)\n## Consecuencias: Positivo: escalabilidad, disponibilidad 99.95%, reducción de ops. Negativo: aumento coste, vendor lock-in, latency internet.', audience: 'CTO / VP Engineering' },
                  { label: 'Code→Docs: API', mode: 'api-docs', input: `// POST /api/orders\nrouter.post('/orders', auth, async (req, res) => {\n  const { items, shipping } = req.body\n  const total = items.reduce((s, i) => s + i.price * i.qty, 0)\n  const order = await db.orders.create({\n    data: { userId: req.user.id, items, total, shipping },\n    include: { items: true }\n  })\n  await inventoryClient.updateStock(items)\n  res.status(201).json(order)\n})`, audience: 'Equipo de desarrollo' },
                ].map(p => (
                  <button key={p.label} onClick={() => { setMode(p.mode); setInput(p.input); setAudience(p.audience) }}
                    style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem', border: '1px solid var(--border)', background: 'rgba(162,155,254,0.08)', color: '#a29bfe', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
              {modes.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'left', cursor: 'pointer',
                  border: mode === m.id ? '1px solid var(--color-translator)' : '1px solid var(--border)',
                  background: mode === m.id ? 'rgba(162,155,254,0.1)' : 'transparent',
                  color: mode === m.id ? 'var(--color-translator)' : 'var(--text-primary)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.125rem' }}>{m.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{m.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Audiencia objetivo</label>
              <select className="input-field" value={audience} onChange={e => setAudience(e.target.value)}>
                <option>CTO / VP Engineering</option>
                <option>CEO / Board</option>
                <option>Product Manager</option>
                <option>Cliente no técnico</option>
                <option>Equipo de desarrollo</option>
                <option>Stakeholder financiero</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                Contenido a traducir *
              </label>
              <textarea className="input-field" rows={8}
                placeholder="Pega ADRs, requisitos, código, postmortems o documentación técnica..."
                value={input} onChange={e => setInput(e.target.value)} />
            </div>

            <AiPanel compact />

            <button className="btn-primary" onClick={handleTranslate} disabled={loading || !input}
              style={{ width: '100%', background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)' }}>
              <ArrowLeftRight size={16} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Traduciendo...' : 'Traducir'}
            </button>
          </div>

          {result && (
            <div className="glass animate-in" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => { navigator.clipboard.writeText(result); setToast('Copiado') }}>
                  <Copy size={12} /> Copiar
                </button>
              </div>
              <pre style={{ margin: 0, maxHeight: 500, overflow: 'auto', fontSize: '0.8rem' }}><code>{result}</code></pre>
            </div>
          )}
          {toast && <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: 'var(--bg-card)', border: '1px solid var(--color-translator)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>{toast}</div>}
        </ModuleLayout>
      </main>
    </div>
  )
}
