import { NextRequest, NextResponse } from 'next/server'

const PROVIDER_META: Record<string, { defaultBaseUrl: string }> = {
  anthropic: { defaultBaseUrl: 'https://api.anthropic.com/v1/messages' },
  opencode: { defaultBaseUrl: 'https://opencode.ai/zen/v1/chat/completions' },
  openai: { defaultBaseUrl: 'https://api.openai.com/v1/chat/completions' },
  openrouter: { defaultBaseUrl: 'https://openrouter.ai/api/v1/chat/completions' },
  custom: { defaultBaseUrl: '' },
}

export async function POST(req: NextRequest) {
  try {
    const { system, prompt, provider, apiKey, model, baseUrl } = await req.json()
    if (!apiKey) return NextResponse.json({ error: 'Missing API key' }, { status: 400 })

    const meta = PROVIDER_META[provider]
    if (!meta) return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 })

    const url = baseUrl || meta.defaultBaseUrl
    const modelId = model || 'nemotron-3-ultra-free'

    let body: any
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }

    if (provider === 'anthropic') {
      headers['x-api-key'] = apiKey
      headers['anthropic-version'] = '2023-06-01'
      body = { model: modelId, system, messages: [{ role: 'user', content: prompt }], max_tokens: 4096 }
    } else if (provider === 'opencode') {
      headers['Authorization'] = `Bearer ${apiKey}`
      body = { model: modelId, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }], max_tokens: 4096 }
    } else {
      headers['Authorization'] = `Bearer ${apiKey}`
      if (provider === 'openrouter') headers['HTTP-Referer'] = 'https://devforge.app'
      body = { model: modelId, messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }], max_tokens: 4096 }
    }

    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
    const data = await res.json()

    if (!res.ok) throw new Error(data.error?.message || JSON.stringify(data).slice(0, 200))

    const result = provider === 'anthropic'
      ? data.content?.[0]?.text
      : data.choices?.[0]?.message?.content

    if (!result) throw new Error('No content in response')

    return NextResponse.json({ result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
