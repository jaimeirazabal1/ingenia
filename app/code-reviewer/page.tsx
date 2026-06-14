'use client'

import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import ModuleLayout from '../../components/ModuleLayout'
import { systemPrompts } from '../../lib/system-prompts'
import { callAi, loadAiConfig } from '../../lib/ai-service'
import { saveAiCallToDb } from '../../lib/api-db'
import AiPanel from '../../components/AiPanel'
import { Copy, Sparkles } from 'lucide-react'

const checklist = [
  { id: 'sqli', label: 'SQL / NoSQL Injection', severity: 'BLOCKER' },
  { id: 'auth', label: 'Broken Authentication / Authorization', severity: 'BLOCKER' },
  { id: 'xss', label: 'XSS / CSRF / SSRF', severity: 'BLOCKER' },
  { id: 'secrets', label: 'Hardcoded Secrets / Credentials', severity: 'BLOCKER' },
  { id: 'deserialization', label: 'Insecure Deserialization', severity: 'BLOCKER' },
  { id: 'race', label: 'Race Conditions / TOCTOU', severity: 'WARNING' },
  { id: 'input', label: 'Input Validation insuficiente', severity: 'WARNING' },
  { id: 'errors', label: 'Error Handling (information leakage)', severity: 'WARNING' },
  { id: 'ratelimit', label: 'Rate Limiting ausente', severity: 'WARNING' },
  { id: 'deps', label: 'Dependencias vulnerables', severity: 'INFO' },
  { id: 'logic', label: 'Errores de lógica de negocio', severity: 'WARNING' },
  { id: 'perf', label: 'Problemas de rendimiento / N+1 queries', severity: 'INFO' },
]

export default function CodeReviewPage() {
  const [code, setCode] = useState('')
  const [context, setContext] = useState('')
  const [checks, setChecks] = useState<string[]>(checklist.map(c => c.id))
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')

  const handleReview = async () => {
    const cfg = loadAiConfig()
    if (!cfg.apiKey) { setToast('Configura tu API key en el panel de modelo'); return }
    setLoading(true)
    try {
      const selectedChecks = checklist.filter(c => checks.includes(c.id))
      const prompt = `Revisa el siguiente código aplicando esta checklist:

${selectedChecks.map(c => `- [${c.severity}] ${c.label}`).join('\n')}

Contexto: ${context || 'No especificado'}

Código a revisar:
\`\`\`
${code}
\`\`\`

Por cada hallazgo, usa el formato:
| # | Archivo | Línea | Severidad | Riesgo | Fix |

Incluye un resumen final con: total de hallazgos por severidad, y los 3 más críticos.`

      const result = await callAi(systemPrompts['code-reviewer'], prompt, cfg)
      setResult(result)
      saveAiCallToDb('code-reviewer', prompt, systemPrompts['code-reviewer'], result, cfg.provider, cfg.model)
    } catch (e: any) { setToast(`Error: ${e.message}`) }
    setLoading(false)
  }

  const toggleCheck = (id: string) => {
    setChecks(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id])
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, minHeight: '100vh' }}>
        <ModuleLayout title="Code Review para Código Generado por IA" subtitle="Audita código con checklist OWASP y detecta code smells" icon="🔍" color="#fdcb6e" badge="#3">
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>🔥 Presets rápidos</div>
              <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'API REST Express.js', ctx: 'API REST pública con autenticación JWT, PostgreSQL, rate limiting', code: `app.post('/api/login', async (req, res) => {\n  const { email, password } = req.body\n  const user = await db.query('SELECT * FROM users WHERE email = ' + email)\n  if (user.password === password) {\n    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)\n    res.json({ token })\n  }\n})` },
                  { label: 'Endpoint de Pagos', ctx: 'Procesador de pagos con Stripe, manejo de webhooks, PostgreSQL', code: `app.post('/api/charge', async (req, res) => {\n  const { amount, currency, source } = req.body\n  const charge = await stripe.charges.create({ amount, currency, source })\n  await db.query('INSERT INTO charges (id, amount) VALUES (?, ?)', [charge.id, amount])\n  res.json({ success: true })\n})` },
                  { label: 'SQL Migration Script', ctx: 'Migración de base de datos PostgreSQL con datos sensibles', code: `ALTER TABLE users ADD COLUMN role VARCHAR(20);\nUPDATE users SET role = 'admin' WHERE email LIKE '%@company.com';\nALTER TABLE users ALTER COLUMN role SET NOT NULL;` },
                  { label: 'React Component', ctx: 'Dashboard con datos de usuario, fetch en cliente, sin caché', code: `function Dashboard() {\n  const [user, setUser] = useState(null)\n  useEffect(() => {\n    fetch('/api/user').then(r => r.json()).then(setUser)\n  }, [])\n  return <div>{user?.ssn}</div>\n}` },
                ].map(p => (
                  <button key={p.label} onClick={() => { setContext(p.ctx); setCode(p.code) }}
                    style={{ padding: '0.35rem 0.7rem', borderRadius: '999px', fontSize: '0.7rem', border: '1px solid var(--border)', background: 'rgba(253,203,110,0.08)', color: '#fdcb6e', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Contexto del código</label>
              <input className="input-field" placeholder="Endpoint de pagos, autenticación, migración de datos..."
                value={context} onChange={e => setContext(e.target.value)} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem', display: 'block' }}>Checklist de revisión</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {checklist.map(c => (
                  <button key={c.id} onClick={() => toggleCheck(c.id)} style={{
                    padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem',
                    border: checks.includes(c.id) ? '1px solid var(--accent)' : '1px solid var(--border)',
                    background: checks.includes(c.id) ? 'rgba(108,92,231,0.15)' : 'transparent',
                    color: checks.includes(c.id) ? 'var(--accent-light)' : 'var(--text-secondary)', cursor: 'pointer',
                  }}>
                    {checks.includes(c.id) ? '✓ ' : ''}{c.label}
                    <span style={{ marginLeft: '0.25rem', opacity: 0.6, fontSize: '0.6rem' }}>{c.severity}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.375rem', display: 'block' }}>Código a revisar *</label>
              <textarea className="input-field" rows={10}
                placeholder="Pega aquí el código generado por IA que quieres auditar..."
                value={code} onChange={e => setCode(e.target.value)} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' }} />
            </div>

            <AiPanel compact />

            <button className="btn-primary" onClick={handleReview} disabled={loading || !code} style={{ width: '100%' }}>
              <Sparkles size={16} style={{ marginRight: '0.5rem' }} />
              {loading ? 'Auditando código...' : 'Ejecutar Code Review'}
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
          {toast && <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', background: 'var(--bg-card)', border: '1px solid var(--accent)', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>{toast}</div>}
        </ModuleLayout>
      </main>
    </div>
  )
}
