'use client'

import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ModuleLayout from '../../components/ModuleLayout'
import { systemPrompts } from '../../lib/system-prompts'
import { callAi, loadAiConfig } from '../../lib/ai-service'
import { saveAiCallToDb } from '../../lib/api-db'
import AiPanel from '../../components/AiPanel'
import { Copy, Sparkles, Download } from 'lucide-react'

export default function ArchitectPage() {
  const [context, setContext] = useState('')
  const [options, setOptions] = useState('')
  const [constraints, setConstraints] = useState('')
  const [mode, setMode] = useState<'adr' | 'tradeoff' | 'review'>('adr')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const prompts: Record<string, string> = {
    adr: `Genera un Architecture Decision Record (ADR) completo siguiendo el formato yad.

Contexto: {{context}}
Opciones consideradas: {{options}}
Restricciones: {{constraints}}

Incluye:
- Título y estado
- Contexto detallado
- Decisión y justificación
- Consecuencias (positivas, negativas, riesgos con mitigaciones)
- Opciones alternativas y por qué se descartaron`,

    tradeoff: `Evalúa las siguientes opciones arquitectónicas y genera una matriz de trade-offs.

Contexto: {{context}}
Opciones: {{options}}
Restricciones: {{constraints}}

Para cada opción, evalúa:
1. Complejidad técnica
2. Coste operativo
3. Escalabilidad
4. Mantenibilidad
5. Rendimiento
6. Seguridad
7. Tiempo de desarrollo
8. Riesgos

Incluye recomendación final con justificación.`,

    review: `Revisa la siguiente arquitectura propuesta e identifica riesgos, antipatrones y mejoras.

Contexto: {{context}}
Restricciones: {{constraints}}

Evalúa:
1. Puntos de fallo (single points of failure)
2. Cuellos de botella de rendimiento
3. Problemas de escalabilidad
4. Violaciones de principios (SOLID, DRY, KISS...)
5. Riesgos de seguridad
6. Deuda técnica potencial
7. Alternativas recomendadas`,
  }

  const handleGenerate = async () => {
    const cfg = loadAiConfig()
    if (!cfg.apiKey) { setToast('Configura tu API key en el panel de modelo'); return }
    setLoading(true)
    try {
      const prompt = prompts[mode]
        .replace('{{context}}', context)
        .replace('{{options}}', options || 'No aplica')
        .replace('{{constraints}}', constraints || 'No especificadas')

      const result = await callAi(systemPrompts.architect, prompt, cfg)
      setResult(result)
      saveAiCallToDb('architect', prompt, systemPrompts.architect, result, cfg.provider, cfg.model)
    } catch (e: any) {
      setToast(`Error: ${e.message}`)
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <ModuleLayout title="Arquitectura y Diseño de Sistemas" subtitle="Diseña, documenta y evalúa arquitecturas con IA" icon="🏗️" color="#6c5ce7" badge="#1">
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>🔥 Presets rápidos</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Microservicios Kafka', mode: 'adr' as const, ctx: 'Sistema de pagos event-driven con 50K tps pico, Kafka como backbone, migrando de monolitos', opts: 'Opción A: Microservicios con Kafka\nOpción B: Módulos en monolitos\nOpción C: Serverless con EventBridge', cons: 'Presupuesto limitado, equipo con experiencia en Java/Spring, deadline 6 meses' },
                  { label: 'API REST Node.js', mode: 'adr' as const, ctx: 'API REST pública para SaaS B2B, autenticación OAuth2, PostgreSQL, 100K usuarios', opts: 'Opción A: Express + Prisma\nOpción B: Fastify + Drizzle\nOpción C: NestJS + TypeORM', cons: 'Equipo pequeño (3 devs), time-to-market crítico' },
                  { label: 'Migración Microservicios', mode: 'review' as const, ctx: 'Migración de monolitos Rails a microservicios Node.js. 20 servicios, comunicación vía HTTP/REST. Despliegue con Docker Compose.', opts: '', cons: 'Sin experiencia previa en microservicios, migración en producción' },
                  { label: 'Serverless Events', mode: 'tradeoff' as const, ctx: 'Sistema de procesamiento de eventos en tiempo real, 10K eventos/min, picos de 50K', opts: 'Lambda + SQS vs ECS + RabbitMQ vs Kafka + K8s', cons: 'Costes operativos ajustados, equipo con experiencia en AWS' },
                ].map(p => (
                  <button key={p.label} onClick={() => { setContext(p.ctx); setOptions(p.opts); setConstraints(p.cons); setMode(p.mode) }}
                    style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem', border: '1px solid var(--border)', background: 'rgba(108,92,231,0.08)', color: 'var(--accent-light)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(['adr', 'tradeoff', 'review'] as const).map(m => (
                <button key={m} className={mode === m ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: '0.8rem' }}
                  onClick={() => setMode(m)}>
                  {m === 'adr' ? '📄 Generar ADR' : m === 'tradeoff' ? '⚖️ Matriz Trade-offs' : '🔍 Revisar Arquitectura'}
                </button>
              ))}
            </div>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Contexto del sistema / problema *</label>
                <textarea className="input-field" rows={4} placeholder="Sistema de pagos event-driven con 50K tps pico, migrando de monolitos..."
                  value={context} onChange={e => setContext(e.target.value)} />
              </div>
              {mode !== 'review' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Opciones consideradas</label>
                  <textarea className="input-field" rows={3} placeholder="Opción A: Microservicios con Kafka&#10;Opción B: Módulos en monolitos&#10;Opción C: Serverless con EventBridge"
                    value={options} onChange={e => setOptions(e.target.value)} />
                </div>
              )}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Restricciones</label>
                <textarea className="input-field" rows={2} placeholder="Presupuesto, timeline, skills del equipo, compliance..."
                  value={constraints} onChange={e => setConstraints(e.target.value)} />
              </div>
              <AiPanel compact />
            </div>

            <button className="btn-primary" onClick={handleGenerate} disabled={loading || !context} style={{ width: '100%' }}>
              <Sparkles size={16} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Generando...' : `Generar ${mode === 'adr' ? 'ADR' : mode === 'tradeoff' ? 'Matriz' : 'Revisión'}`}
            </button>
          </div>

          {result && (
            <div className="glass animate-in" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button className="btn-secondary" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => { navigator.clipboard.writeText(result); setToast('Copiado') }}>
                  <Copy size={12} /> Copiar
                </button>
                <button className="btn-secondary" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => { const b = new Blob([result], { type: 'text/markdown' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'adr.md'; a.click(); }}>
                  <Download size={12} /> Descargar
                </button>
              </div>
              <pre style={{ margin: 0, maxHeight: 500, overflow: 'auto', fontSize: '0.8rem' }}><code>{result}</code></pre>
            </div>
          )}

          {toast && <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: 'var(--bg-card)', border: '1px solid var(--accent)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>{toast}</div>}
        </ModuleLayout>
      </main>
    </div>
  )
}
