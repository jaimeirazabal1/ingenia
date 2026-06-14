'use client'

import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ModuleLayout from '../../components/ModuleLayout'
import { systemPrompts } from '../../lib/system-prompts'
import { callAi, loadAiConfig } from '../../lib/ai-service'
import { saveAiCallToDb } from '../../lib/api-db'
import AiPanel from '../../components/AiPanel'
import { Copy, Sparkles, BookOpen } from 'lucide-react'

const topics = [
  { id: 'distributed-systems', label: 'Sistemas Distribuidos', icon: '🌐',
    desc: 'CAP, consistencia, particionamiento, RPC, consenso' },
  { id: 'databases', label: 'Bases de Datos', icon: '🗄️',
    desc: 'Índices, transacciones, aislamiento, normalización, sharding' },
  { id: 'networking', label: 'Redes', icon: '🔗',
    desc: 'TCP/IP, DNS, HTTP/2, balanceo, latencia, throughput' },
  { id: 'os', label: 'Sistemas Operativos', icon: '⚙️',
    desc: 'Threads, memoria, filesystem, syscalls, scheduling' },
  { id: 'algorithms', label: 'Algoritmos y Estructuras', icon: '📐',
    desc: 'Complejidad, búsqueda, ordenamiento, árboles, grafos' },
]

const aiPitfalls: Record<string, string[]> = {
  'distributed-systems': [
    'La IA suele asumir consistencia fuerte cuando el caso de uso requiere eventual consistency',
    'Suele ignorar particiones de red y timeouts en sistemas distribuidos',
    'Recomienda consensus algorithms sin considerar el overhead de latencia',
  ],
  'databases': [
    'La IA tiende a sugerir JOINs costosos sin considerar índices',
    'Suele ignorar aislamiento de transacciones (fenómenos de concurrencia)',
    'Recomienda sharding sin analizar patrones de acceso a datos',
  ],
  'networking': [
    'La IA asume latencia cero en llamadas entre servicios',
    'Ignora el overhead de handshakes TLS en conexiones frecuentes',
    'Subestima el impacto de packet loss en protocolos síncronos',
  ],
  'os': [
    'La IA ignoria context-switching overhead al diseñar concurrencia',
    'Asume memoria infinita en cachés y buffers',
    'Suele ignorar page faults y thrashing',
  ],
  'algorithms': [
    'La IA elige estructuras de datos sin considerar patrones de acceso reales',
    'Suele ignorar cache locality y CPU cache lines',
    'Recomienda algoritmos óptimos en teoría pero impracticos en el contexto real',
  ],
}

export default function FundamentalsPage() {
  const [topic, setTopic] = useState(topics[0].id)
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const handleAsk = async () => {
    const cfg = loadAiConfig()
    if (!cfg.apiKey) { setToast('Configura tu API key en el panel de modelo'); return }
    setLoading(true)
    try {
      const pitfalls = aiPitfalls[topic] || []
      const prompt = `Tópico: ${topics.find(t => t.id === topic)?.label}

Pregunta/Problema del usuario:
${question || 'Explica los fundamentos clave y los errores típicos que comete la IA al generar código relacionado con este tema.'}

Instrucciones:
1. Explica el concepto fundamental de forma clara y con ejemplos concretos
2. Identifica los errores típicos que la IA (ChatGPT, Claude, Copilot) suele cometer al generar código relacionado con este tema
3. Trampas comunes que la IA no detecta:
${pitfalls.map(p => `- ${p}`).join('\n')}
4. Proporciona un ejemplo concreto de un bug real que la IA podría generar y cómo solucionarlo
5. Recomendaciones para hacer prompting efectivo en este tema (qué incluir en el prompt para evitar errores)`

      const result = await callAi(systemPrompts.fundamentals, prompt, cfg)
      setResult(result)
      saveAiCallToDb('fundamentals', prompt, systemPrompts.fundamentals, result, cfg.provider, cfg.model)
    } catch (e: any) { setToast(`Error: ${e.message}`) }
    setLoading(false)
  }

  const selTopic = topics.find(t => t.id === topic)

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <ModuleLayout title="Fundamentos CS para la Era IA" subtitle="Domina los fundamentos que la IA aún no domina por ti" icon="📚" color="#00b894" badge="#6">
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>🔥 Presets rápidos</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Cache: LRU vs LFU', topic: 'algorithms', question: 'Compara LRU y LFU para un sistema de caché de 10GB con patrones de acceso tipo zipfian. ¿Cuál elegirías y por qué? ¿Qué errores típicos comete la IA al implementar una caché?' },
                  { label: 'Rate Limiting', topic: 'distributed-systems', question: 'Diseña un sistema de rate limiting distribuido para una API con 100K RPM. Compara Token Bucket vs Sliding Window. ¿Qué problemas de consistencia surgen y cómo los resuelves?' },
                  { label: 'Índices en BD', topic: 'databases', question: 'Explica índices compuestos, covering indexes y index-only scans. ¿Qué errores comete la IA al sugerir índices? Da ejemplos de índices que parecen buenos pero empeoran el rendimiento.' },
                  { label: 'CAP en la práctica', topic: 'distributed-systems', question: 'Explica el teorema CAP con ejemplos reales de sistemas que priorizan consistencia vs disponibilidad. ¿Dónde se confunde la IA al aplicar CAP? ¿Qué pasa con particiones de red?' },
                ].map(p => (
                  <button key={p.label} onClick={() => { setTopic(p.topic); setQuestion(p.question) }}
                    style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem', border: '1px solid var(--border)', background: 'rgba(0,184,148,0.08)', color: '#00b894', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
              {topics.map(t => (
                <button key={t.id} onClick={() => setTopic(t.id)} style={{
                  padding: '0.6rem', borderRadius: '0.5rem', textAlign: 'left', cursor: 'pointer',
                  border: topic === t.id ? '1px solid var(--color-fundamentals)' : '1px solid var(--border)',
                  background: topic === t.id ? 'rgba(0,184,148,0.1)' : 'transparent',
                  color: topic === t.id ? 'var(--color-fundamentals)' : 'var(--text-primary)',
                }}>
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{t.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.125rem' }}>{t.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{t.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(255,107,107,0.08)', borderRadius: '0.5rem', border: '1px solid rgba(255,107,107,0.2)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)', marginBottom: '0.375rem' }}>⚠️ AI Pitfalls en {selTopic?.label}</div>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {(aiPitfalls[topic] || []).map(p => <li key={p} style={{ marginBottom: '0.125rem' }}>{p}</li>)}
              </ul>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>
                Tu pregunta o problema técnico
              </label>
              <textarea className="input-field" rows={4}
                placeholder="¿Qué concepto quieres entender a fondo? ¿Has visto a la IA cometer algún error específico?"
                value={question} onChange={e => setQuestion(e.target.value)} />
            </div>

            <AiPanel compact />

            <button className="btn-primary" onClick={handleAsk} disabled={loading}
              style={{ width: '100%', background: 'linear-gradient(135deg, #00b894, #00cec9)' }}>
              <BookOpen size={16} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Consultando...' : 'Aprender y Descubrir AI Pitfalls'}
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
          {toast && <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: 'var(--bg-card)', border: '1px solid var(--color-fundamentals)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>{toast}</div>}
        </ModuleLayout>
      </main>
    </div>
  )
}
