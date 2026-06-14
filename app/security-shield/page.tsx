'use client'

import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ModuleLayout from '../../components/ModuleLayout'
import { systemPrompts } from '../../lib/system-prompts'
import { callAi, loadAiConfig } from '../../lib/ai-service'
import { saveAiCallToDb } from '../../lib/api-db'
import AiPanel from '../../components/AiPanel'
import { Copy, Sparkles } from 'lucide-react'

const complianceOptions = ['PCI-DSS', 'GDPR', 'SOC2', 'HIPAA', 'ISO 27001', 'SOX', 'NIST', 'OWASP ASVS']

export default function SecurityPage() {
  const [code, setCode] = useState('')
  const [compliance, setCompliance] = useState<string[]>(['OWASP ASVS'])
  const [context, setContext] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const handleScan = async () => {
    const cfg = loadAiConfig()
    if (!cfg.apiKey) { setToast('Configura tu API key en el panel de modelo'); return }
    setLoading(true)
    try {
      const prompt = `Analiza la seguridad del siguiente código:

Contexto: ${context || 'No especificado'}
Compliance requerido: ${compliance.join(', ')}

Código:
\`\`\`
${code}
\`\`\`

Para cada vulnerabilidad encontrada, proporciona:
1. Tipo de vulnerabilidad (con referencia CWE cuando aplique)
2. Línea exacta
3. Riesgo (Crítico/Alto/Medio/Bajo)
4. Explicación del impacto
5. Código de fix concreto
6. Referencia de compliance afectada (${compliance.join(', ')})

Además:
- Busca secrets/credenciales hardcodeadas
- Verifica validación de inputs
- Revisa autenticación y autorización
- Detecta configuraciones inseguras
- Identifica dependencias con vulnerabilidades conocidas`

      const result = await callAi(systemPrompts.security, prompt, cfg)
      setResult(result)
      saveAiCallToDb('security', prompt, systemPrompts.security, result, cfg.provider, cfg.model)
    } catch (e: any) { setToast(`Error: ${e.message}`) }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <ModuleLayout title="Seguridad en Código Generado por IA" subtitle="Escáner de vulnerabilidades, secrets y compliance" icon="🛡️" color="#ff6b6b" badge="#4">
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>🔥 Presets rápidos</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'App de Pagos (PCI)', ctx: 'Sistema de procesamiento de pagos con tarjetas de crédito, cumple PCI-DSS Nivel 1', compliance: ['PCI-DSS', 'OWASP ASVS'], code: `app.post('/api/payment', async (req, res) => {\n  const { ccNumber, expiry, cvv, amount } = req.body\n  const query = 'INSERT INTO payments (cc, amount) VALUES (\"' + ccNumber + '\", ' + amount + ')'\n  await db.execute(query)\n  res.json({ status: 'ok' })\n})` },
                  { label: 'SaaS Multi-tenant', ctx: 'Aplicación SaaS multi-tenant con aislamiento de datos por cliente', compliance: ['SOC2', 'GDPR'], code: `function getUsers(req) {\n  const tenant = req.headers['x-tenant-id']\n  return db.query('SELECT * FROM users')\n}` },
                  { label: 'API GraphQL', ctx: 'API GraphQL pública con autenticación por API key, datos de usuarios', compliance: ['OWASP ASVS'], code: `const resolvers = {\n  Query: {\n    users: (_, args, ctx) => {\n      return db.users.findMany({\n        where: args.filter || {}\n      })\n    },\n    user: (_, { id }) => db.users.findUnique({ where: { id } })\n  }\n}` },
                  { label: 'App IoT + Firmware', ctx: 'Dispositivo IoT con firmware OTA, comunicación MQTT, datos de telemetría', compliance: ['ISO 27001', 'NIST'], code: `function processTelemetry(deviceId, data) {\n  const cmd = 'sudo fw_update --device ' + deviceId + ' --payload ' + data\n  exec(cmd, (err, out) => console.log(out))\n}` },
                ].map(p => (
                  <button key={p.label} onClick={() => { setContext(p.ctx); setCompliance(p.compliance); setCode(p.code) }}
                    style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem', border: '1px solid var(--border)', background: 'rgba(255,107,107,0.08)', color: '#ff6b6b', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Estándares de compliance</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {complianceOptions.map(c => (
                  <button key={c} onClick={() => setCompliance(x => x.includes(c) ? x.filter(v => v !== c) : [...x, c])} style={{
                    padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem',
                    border: compliance.includes(c) ? '1px solid var(--danger)' : '1px solid var(--border)',
                    background: compliance.includes(c) ? 'rgba(255,107,107,0.15)' : 'transparent',
                    color: compliance.includes(c) ? 'var(--danger)' : 'var(--text-secondary)', cursor: 'pointer',
                  }}>
                    {compliance.includes(c) ? '✓ ' : ''}{c}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Contexto / Descripción del sistema</label>
              <input className="input-field" placeholder="Sistema de pagos, datos médicos, SaaS multi-tenant..."
                value={context} onChange={e => setContext(e.target.value)} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Código a auditar *</label>
              <textarea className="input-field" rows={10}
                placeholder="Pega el código (generado por IA o no) para análisis de seguridad..."
                value={code} onChange={e => setCode(e.target.value)} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' }} />
            </div>

            <AiPanel compact />

            <button className="btn-primary" onClick={handleScan} disabled={loading || !code} style={{ width: '100%', background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
              <Sparkles size={16} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Escaneando...' : 'Ejecutar Auditoría de Seguridad'}
            </button>
          </div>

          {result && (
            <div className="glass animate-in" style={{ borderRadius: '0.75rem', overflow: 'hidden' }}>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button className="btn-secondary" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                  onClick={() => { navigator.clipboard.writeText(result); setToast('Copiado') }}>
                  <Copy size={12} /> Copiar
                </button>
              </div>
              <pre style={{ margin: 0, maxHeight: 500, overflow: 'auto', fontSize: '0.8rem' }}><code>{result}</code></pre>
            </div>
          )}
          {toast && <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: 'var(--bg-card)', border: '1px solid var(--danger)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>{toast}</div>}
        </ModuleLayout>
      </main>
    </div>
  )
}
