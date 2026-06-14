import { templates, type PromptTemplate } from './templates'

function resolveValue(value: any): string {
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }
  return String(value || '')
}

export function generatePrompt(template: PromptTemplate, values: Record<string, any>): string {
  let prompt = template.promptTemplate

  for (const field of template.fields) {
    const val = values[field.id]
    const resolved = resolveValue(val)

    if (field.type === 'checkbox' && !val) {
      prompt = prompt.replace(new RegExp(`\\{\\{#if ${field.id}\\}\\}[\\s\\S]*?\\{\\{/if\\}\\}`, 'g'), '')
      continue
    }

    if (field.type === 'multiselect' && Array.isArray(val) && val.length === 0) {
      prompt = prompt.replace(new RegExp(`\\{\\{#if ${field.id}\\}\\}[\\s\\S]*?\\{\\{/if\\}\\}`, 'g'), '')
      continue
    }

    if ((field.type === 'text' || field.type === 'textarea' || field.type === 'select') && !val) {
      prompt = prompt.replace(new RegExp(`\\{\\{#if ${field.id}\\}\\}[\\s\\S]*?\\{\\{/if\\}\\}`, 'g'), '')
      continue
    }

    prompt = prompt.replace(new RegExp(`\\{\\{#if ${field.id}\\}\\}`, 'g'), '')
    prompt = prompt.replace(new RegExp(`\\{\\{/if\\}\\}`, 'g'), '')
  }

  for (const field of template.fields) {
    const val = values[field.id]
    const resolved = resolveValue(val)
    prompt = prompt.replace(new RegExp(`\\{\\{${field.id}\\}\\}`, 'g'), resolved)
  }

  prompt = prompt.replace(/\{\{#if .*?\}\}[\s\S]*?\{\{\/if\}\}/g, '')
  prompt = prompt.replace(/\{\{(.+?)\}\}/g, (match, key) => {
    const trimmed = key.trim()
    if (trimmed.startsWith('#if') || trimmed === 'else' || trimmed.startsWith('/if') || trimmed.startsWith('each') || trimmed.startsWith('/each')) {
      return ''
    }
    return match
  })

  prompt = prompt.replace(/\n{3,}/g, '\n\n').trim()

  return prompt
}

export function generateClaudeMd(template: PromptTemplate, values: Record<string, any>): string {
  if (template.id === 'claude-md') {
    return generatePrompt(template, values)
  }

  let md = `# Contexto del Proyecto

## Proyecto
${values.projectDesc || values.featureDesc || values.serviceDesc || values.codeContext || ''}

## Stack Tecnológico
${values.techStack || values.framework || ''}

## Arquitectura
${values.architecture || ''}

## Reglas y Restricciones
${values.constraints || values.businessRules || ''}

## Prompt Generado
\`\`\`
${generatePrompt(template, values)}
\`\`\`
`
  return md.trim()
}
