export type AiProvider = 'anthropic' | 'opencode' | 'openai' | 'openrouter' | 'custom'

export interface AiConfig {
  provider: AiProvider
  apiKey: string
  model: string
  baseUrl?: string
}

const STORAGE_KEY = 'devforge-ai-config'

const DEFAULT_CONFIG: AiConfig = {
  provider: 'opencode',
  apiKey: '',
  model: 'nemotron-3-ultra-free',
}

const PROVIDER_META: Record<AiProvider, {
  name: string
  defaultBaseUrl: string
  defaultModel: string
  models: string[]
}> = {
  anthropic: {
    name: 'Anthropic',
    defaultBaseUrl: 'https://api.anthropic.com/v1/messages',
    defaultModel: 'claude-sonnet-4-20250514',
    models: ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-3-5-20241022', 'claude-sonnet-4-6-20250514'],
  },
  opencode: {
    name: 'OpenCode Zen',
    defaultBaseUrl: 'https://opencode.ai/zen/v1/chat/completions',
    defaultModel: 'nemotron-3-ultra-free',
    models: ['nemotron-3-ultra-free', 'deepseek-v4-flash-free', 'mimo-v2.5-free', 'north-mini-code-free', 'big-pickle', 'deepseek-v4-flash', 'gpt-5.4-nano', 'claude-sonnet-4-6', 'claude-haiku-4-5', 'kimi-k2.5', 'gemini-3-flash', 'qwen3.7-plus'],
  },
  openai: {
    name: 'OpenAI',
    defaultBaseUrl: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o',
    models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-4.1', 'gpt-4.1-nano', 'gpt-4.1-mini'],
  },
  openrouter: {
    name: 'OpenRouter',
    defaultBaseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    defaultModel: 'openai/gpt-4o',
    models: ['anthropic/claude-sonnet-4', 'openai/gpt-4o', 'google/gemini-2.0-flash-001', 'meta-llama/llama-4-maverick', 'deepseek/deepseek-chat'],
  },
  custom: {
    name: 'Custom',
    defaultBaseUrl: '',
    defaultModel: '',
    models: [],
  },
}

export function getProviderMeta(provider: AiProvider) {
  return PROVIDER_META[provider]
}

export function loadAiConfig(): AiConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_CONFIG
}

export function saveAiConfig(config: AiConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export async function callAi(system: string, userPrompt: string, config?: AiConfig): Promise<string> {
  const cfg = config || loadAiConfig()
  if (!cfg.apiKey) throw new Error('API key not configured')

  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system,
      prompt: userPrompt,
      provider: cfg.provider,
      apiKey: cfg.apiKey,
      model: cfg.model,
      baseUrl: cfg.baseUrl,
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`)
  return data.result
}
