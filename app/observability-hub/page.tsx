'use client'

import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ModuleLayout from '../../components/ModuleLayout'
import { systemPrompts } from '../../lib/system-prompts'
import { callAi, loadAiConfig } from '../../lib/ai-service'
import { saveAiCallToDb } from '../../lib/api-db'
import AiPanel from '../../components/AiPanel'
import { Copy, Sparkles, Activity } from 'lucide-react'

const scenarios = [
  { id: 'otel-setup', label: 'OpenTelemetry Setup', desc: 'Configuración inicial de tracing, metrics y logs',
    tech: 'OpenTelemetry Collector + OTLP' },
  { id: 'grafana-dashboard', label: 'Dashboard Grafana', desc: 'Dashboard de latencia, errores y throughput',
    tech: 'Grafana + Prometheus' },
  { id: 'datadog-monitor', label: 'Monitor Datadog', desc: 'Monitores con alertas y SLOs',
    tech: 'Datadog + PagerDuty' },
  { id: 'slo-setup', label: 'SLOs y Error Budgets', desc: 'Definición de SLOs, SLIs y error budgets',
    tech: 'SLO Framework' },
  { id: 'runbook', label: 'Runbook de Incidente', desc: 'Runbook para diagnóstico y mitigación',
    tech: 'Runbook Automation' },
  { id: 'alert-rules', label: 'Reglas de Alerta', desc: 'Alertas basadas en métricas y logs',
    tech: 'PromQL / LogQL' },
]

export default function ObservabilityPage() {
  const [scenario, setScenario] = useState(scenarios[0].id)
  const [context, setContext] = useState('API REST de pagos, Node.js, PostgreSQL, Redis, Kafka')
  const [extra, setExtra] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const handleGenerate = async () => {
    const cfg = loadAiConfig()
    if (!cfg.apiKey) { setToast('Configura tu API key en el panel de modelo'); return }
    setLoading(true)
    try {
      const sel = scenarios.find(s => s.id === scenario)
      const prompts: Record<string, string> = {
        'otel-setup': `Genera una configuración completa de OpenTelemetry para el siguiente sistema:

Contexto del sistema: ${context}
Requisitos adicionales: ${extra || 'Ninguno'}

Incluye:
1. Configuración del OpenTelemetry Collector (collector.yml)
2. Instrumentación del servicio (Node.js con @opentelemetry/*)
3. Exportadores configurados (OTLP, Prometheus, stdout)
4. Samplig rates recomendados
5. Atributos semánticos personalizados para el dominio de negocio
6. Consideraciones de performance y overhead`,
        'grafana-dashboard': `Genera un dashboard de Grafana en formato JSON para el sistema:

Contexto: ${context}
Extra: ${extra || 'Ninguno'}

El dashboard debe incluir:
1. Latencia (p50, p95, p99) por servicio
2. Tasa de error por endpoint
3. Throughput (RPM)
4. Uso de recursos (CPU, memoria, conexiones)
5. Panel de base de datos (slow queries, conexiones activas)
6. Panel de negocio (transacciones exitosas vs fallidas)`,
        'datadog-monitor': `Genera configuración de monitores Datadog para:

Contexto: ${context}
Extra: ${extra || 'Ninguno'}

Incluye:
1. Monitor de latencia p99 > 500ms
2. Monitor de tasa de error > 1%
3. Monitor de health check endpoint
4. Monitor de cola Kafka creciendo
5. SLOs asociados
6. Notificaciones y escalamiento`,
        'slo-setup': `Define SLOs y SLIs para el sistema:

Contexto: ${context}
Extra: ${extra || 'Ninguno'}

Incluye:
1. SLIs clave (latencia, disponibilidad, durabilidad, correctness)
2. SLOs para cada SLI (targets por severidad)
3. Error budgets semanales/mensuales
4. Políticas de burn rate
5. Multi-window, multi-burn rate alerts
6. Dashboard de error budget`,
        'runbook': `Genera un runbook completo para diagnosticar y mitigar incidentes en:

Contexto: ${context}
Extra: ${extra || 'Ninguno'}

Incluye:
1. Síntomas y causas raíz más comunes
2. Pasos de diagnóstico (checklist)
3. Comandos y dashboards relevantes
4. Estrategias de mitigación
5. Criterios de escalamiento
6. Postmortem template`,
        'alert-rules': `Genera reglas de alerta para el sistema:

Contexto: ${context}
Extra: ${extra || 'Ninguno'}

Incluye:
1. Reglas PromQL para Prometheus
2. Reglas LogQL para Loki
3. Severidad y umbrales
4. Anotaciones y labels
5. Routing a canales de notificación
6. Prevención de alert fatigue`,
      }

      const result = await callAi(systemPrompts.observability, prompts[scenario], cfg)
      setResult(result)
      saveAiCallToDb('observability', prompts[scenario], systemPrompts.observability, result, cfg.provider, cfg.model)
    } catch (e: any) { setToast(`Error: ${e.message}`) }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <ModuleLayout title="Observability Hub" subtitle="OpenTelemetry, dashboards, alertas, SLOs y runbooks" icon="📊" color="#0984e3" badge="#7">
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>🔥 Presets rápidos</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'OTEL Microservicio', scenario: 'otel-setup', context: 'API REST de pagos, Node.js, PostgreSQL, Redis, Kafka', extra: '5 servicios, K8s (EKS), 50K RPM pico' },
                  { label: 'Dashboard SLO', scenario: 'slo-setup', context: 'API REST de pagos, Node.js, PostgreSQL, Redis, Kafka', extra: 'SLO 99.9% disponibilidad, error budget 0.1%' },
                  { label: 'Runbook: Latencia', scenario: 'runbook', context: 'API REST de pagos, Node.js, PostgreSQL, Redis, Kafka', extra: 'Incidentes de latencia p99 > 2s en horario pico' },
                  { label: 'Alertas Pagos', scenario: 'alert-rules', context: 'API REST de pagos, Node.js, PostgreSQL, Redis, Kafka', extra: 'Alertas para fallos de pago, latencia alta, cola Kafka creciendo' },
                ].map(p => (
                  <button key={p.label} onClick={() => { setScenario(p.scenario); setContext(p.context); setExtra(p.extra) }}
                    style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem', border: '1px solid var(--border)', background: 'rgba(9,132,227,0.08)', color: '#0984e3', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
              {scenarios.map(s => (
                <button key={s.id} onClick={() => setScenario(s.id)} style={{
                  padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'left', cursor: 'pointer',
                  border: scenario === s.id ? '1px solid var(--color-observability)' : '1px solid var(--border)',
                  background: scenario === s.id ? 'rgba(9,132,227,0.1)' : 'transparent',
                  color: scenario === s.id ? 'var(--color-observability)' : 'var(--text-primary)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.125rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{s.desc}</div>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.25rem', opacity: 0.7 }}>{s.tech}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Descripción del sistema *</label>
              <input className="input-field"
                placeholder="API REST de pagos, Node.js, PostgreSQL, Redis, Kafka"
                value={context} onChange={e => setContext(e.target.value)} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Requisitos adicionales</label>
              <textarea className="input-field" rows={2}
                placeholder="Escala esperada, servicios específicos, integraciones, restricciones..."
                value={extra} onChange={e => setExtra(e.target.value)} />
            </div>

            <AiPanel compact />

            <button className="btn-primary" onClick={handleGenerate} disabled={loading || !context}
              style={{ width: '100%', background: 'linear-gradient(135deg, #0984e3, #6c5ce7)' }}>
              <Activity size={16} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Generando...' : 'Generar Configuración de Observabilidad'}
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
          {toast && <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: 'var(--bg-card)', border: '1px solid var(--color-observability)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>{toast}</div>}
        </ModuleLayout>
      </main>
    </div>
  )
}
