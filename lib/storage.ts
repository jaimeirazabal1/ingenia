export interface SavedPrompt {
  id: string
  name: string
  templateId: string
  templateName: string
  values: Record<string, any>
  generatedPrompt: string
  createdAt: string
  updatedAt: string
  version: number
}

const STORAGE_KEY = 'deep-prompt-history'

export function getSavedPrompts(): SavedPrompt[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function savePrompt(prompt: Omit<SavedPrompt, 'id' | 'createdAt' | 'updatedAt' | 'version'>): SavedPrompt {
  const history = getSavedPrompts()
  const existing = history.find(h => h.templateId === prompt.templateId && h.name === prompt.name)

  let saved: SavedPrompt
  if (existing) {
    saved = {
      ...existing,
      values: prompt.values,
      generatedPrompt: prompt.generatedPrompt,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    }
    const idx = history.findIndex(h => h.id === existing.id)
    history[idx] = saved
  } else {
    saved = {
      ...prompt,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    }
    history.unshift(saved)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return saved
}

export function deletePrompt(id: string): void {
  const history = getSavedPrompts()
  const filtered = history.filter(h => h.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function getPromptById(id: string): SavedPrompt | undefined {
  return getSavedPrompts().find(h => h.id === id)
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
