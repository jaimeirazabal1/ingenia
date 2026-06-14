import { callAi, loadAiConfig } from './ai-service'

export interface AIResponse {
  suggestion: string
  improvements: string[]
}

const IMPROVE_SYSTEM_PROMPT = `Eres un experto en Context Engineering para IA. Tu misión es analizar y mejorar prompts para asistentes de código (Claude, Cursor, Copilot).

Evalúa el prompt según estos criterios:
1. **Contexto arquitectónico**: ¿Describe el patrón, stack y restricciones del sistema?
2. **Especificidad**: ¿Es lo suficientemente detallado para que una IA produzca código shippable?
3. **Restricciones**: ¿Define límites claros (seguridad, rendimiento, compliance)?
4. **Formato de salida**: ¿Especifica cómo debe entregarse el resultado?

Devuelve tu respuesta como JSON con:
- "suggestion": El prompt mejorado con contexto adicional
- "improvements": Array de 3-5 mejoras específicas aplicadas`

export async function improvePrompt(prompt: string): Promise<AIResponse> {
  const cfg = loadAiConfig()
  if (!cfg.apiKey) {
    return {
      suggestion: prompt,
      improvements: ['Configura tu API key en el panel de modelo primero'],
    }
  }

  try {
    const result = await callAi(
      IMPROVE_SYSTEM_PROMPT,
      `Analiza y mejora este prompt:\n\n${prompt}`,
      cfg,
    )

    try {
      const parsed = JSON.parse(result)
      return {
        suggestion: parsed.suggestion || result,
        improvements: parsed.improvements || ['No se pudieron extraer mejoras específicas'],
      }
    } catch {
      return {
        suggestion: result,
        improvements: ['Revisa el prompt mejorado arriba'],
      }
    }
  } catch (e: any) {
    throw new Error(`Error al mejorar prompt: ${e.message}`)
  }
}
