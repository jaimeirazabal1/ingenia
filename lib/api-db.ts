export async function saveAiCallToDb(
  module: string,
  prompt: string,
  systemPrompt: string,
  result: string,
  provider?: string,
  model?: string,
) {
  try {
    const id = crypto.randomUUID()
    await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, module, prompt, system_prompt: systemPrompt, result, provider, model }),
    })
  } catch {}
}

export async function saveApiKeyToDb(provider: string, key: string) {
  try {
    const id = `${provider}-${Date.now()}`
    await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, provider, key, label: `${provider} key` }),
    })
  } catch {}
}

export async function loadSavedKeys(): Promise<{ id: string; provider: string; label: string | null }[]> {
  try {
    const res = await fetch('/api/keys')
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}

export async function deleteSavedKey(id: string) {
  try {
    await fetch(`/api/keys?id=${id}`, { method: 'DELETE' })
  } catch {}
}
