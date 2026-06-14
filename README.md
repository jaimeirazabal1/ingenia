# InGenIA

Plataforma modular de ingeniería de software aumentada por IA. Arquitectura, Code Review, Seguridad, Traducción Técnica, Fundamentos CS y Observabilidad — todo en un solo lugar con soporte multi-provider.

## Módulos

| Módulo | Descripción |
|--------|-------------|
| 🏗️ **Arquitectura** | ADRs, trade-offs arquitectónicos, identificación de riesgos |
| ⚡ **Context Engineering** | 9 templates para prompts profundos con contexto completo |
| 🔍 **Code Review** | Auditoría de código con checklist OWASP + IA |
| 🛡️ **Seguridad** | Análisis de vulnerabilidades, compliance, threat modeling |
| 💬 **Traductor Técnico** | Comunicación entre ingeniería y stakeholders |
| 📚 **Fundamentos CS** | Algoritmos, sistemas distribuidos, trade-offs técnicos |
| 📊 **Observabilidad** | OpenTelemetry, dashboards, SLOs, runbooks |

## Proveedores Soportados

- OpenAI
- Anthropic Claude
- OpenCode Zen
- OpenRouter
- Custom (cualquier API compatible con OpenAI)

## Stack

- **Frontend**: React 19, Next.js 16, TypeScript 6, Tailwind v4
- **Backend**: Next.js API Routes (server-to-server, sin CORS)
- **Base de datos**: SQLite via better-sqlite3
- **Despliegue**: Docker (multi-stage, node:22-alpine)

## Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Build para producción
npm run build

# Docker
docker build -t ingenia .
docker run -p 4000:4000 ingenia
```

## Configuración

Variables de entorno (`.env`):

```
ENCRYPTION_KEY=tu-clave-de-32-caracteres
```

Las API keys se configuran desde la interfaz y se almacenan cifradas con AES-256-CBC.

## Licencia

MIT
