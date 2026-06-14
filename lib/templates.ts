export interface TemplateField {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox'
  placeholder?: string
  options?: string[]
  suggestions?: string[]
  required: boolean
  helpText?: string
}

export interface PromptTemplate {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
  fields: TemplateField[]
  promptTemplate: string
}

export const templates: PromptTemplate[] = [
  {
    id: 'backend-api',
    name: 'Backend API Endpoint',
    description: 'Implementar endpoints con contexto completo de arquitectura, base de datos, eventos y restricciones',
    icon: 'server',
    color: '#6c5ce7',
    category: 'backend',
    fields: [
      { id: 'projectDesc', label: 'Descripción del proyecto', type: 'textarea', suggestions: ['Sistema de pagos con Stripe', 'Plataforma SaaS multi-tenant', 'Marketplace con chat', 'Dashboard analítico en tiempo real', 'Sistema de reservas online'], placeholder: 'Sistema de pagos, plataforma SaaS, etc.', required: true, helpText: 'Qué hace el sistema y su propósito principal' },
      { id: 'techStack', label: 'Tech Stack', type: 'multiselect', options: ['TypeScript/Node', 'Python/FastAPI', 'Go', 'Rust', 'Java/Spring', 'C#/.NET', 'Ruby/Rails'], required: true },
      { id: 'framework', label: 'Framework', type: 'text', suggestions: ['Express', 'NestJS', 'FastAPI', 'Gin', 'Spring Boot', 'Next.js'], placeholder: 'Express, NestJS, FastAPI, Gin...', required: true },
      { id: 'database', label: 'Base de datos', type: 'multiselect', options: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'DynamoDB', 'Redis', 'Elasticsearch'], required: true },
      { id: 'orm', label: 'ORM / Query Builder', type: 'text', suggestions: ['Prisma', 'Drizzle', 'TypeORM', 'SQLAlchemy', 'Mongoose', 'Knex'], placeholder: 'Prisma, Drizzle, TypeORM, SQLAlchemy...', required: false },
      { id: 'cloud', label: 'Cloud / Infra', type: 'multiselect', options: ['AWS', 'GCP', 'Azure', 'Cloudflare', 'Vercel', 'Railway', 'Self-hosted'], required: false },
      { id: 'architecture', label: 'Patrón arquitectónico', type: 'select', options: ['Monolítico', 'Microservicios', 'Event-Driven', 'Serverless', 'Hexagonal/Ports & Adapters', 'Clean Architecture', 'CQRS'], required: true },
      { id: 'events', label: 'Mensajería / Eventos', type: 'text', suggestions: ['Kafka', 'RabbitMQ', 'SQS/SNS', 'EventBridge', 'Redis Pub/Sub', 'NATS'], placeholder: 'Kafka, RabbitMQ, SQS/SNS, EventBridge...', required: false, helpText: 'Sistema de mensajería si aplica' },
      { id: 'constraints', label: 'Restricciones técnicas', type: 'textarea', suggestions: ['Idempotencia obligatoria en todos los endpoints', 'Zero-downtime deployments', 'Rate limiting: 100 RPM por usuario', 'Consistencia eventual aceptable', 'Paginación obligatoria en listados', 'Soft-delete, no borrado físico', 'Tiempo de respuesta < 200ms p99'], placeholder: 'Idempotencia, rate limiting, consistencia eventual, zero-downtime...', required: true, helpText: 'Restricciones NO negociables' },
      { id: 'security', label: 'Requisitos de seguridad', type: 'textarea', suggestions: ['Autenticación JWT + refresh tokens', 'Autorización RBAC por roles', 'Cifrado en reposo (AES-256)', 'HTTPS / TLS 1.3 obligatorio', 'Cumplir PCI-DSS nivel 1', 'GDPR: derecho al olvido', 'Rate limiting por IP y usuario'], placeholder: 'Autenticación, autorización, cifrado, PCI-DSS, GDPR...', required: false },
      { id: 'observability', label: 'Observabilidad', type: 'text', suggestions: ['OpenTelemetry + Jaeger', 'Datadog APM', 'AWS CloudWatch', 'Grafana + Prometheus', 'Logs estructurados (JSON)', 'Sentry para errores'], placeholder: 'OpenTelemetry, Datadog, CloudWatch, logs estructurados...', required: false },
    ],
    promptTemplate: `Eres un backend engineer en {{projectDesc}}.

## Stack tecnológico
- Lenguaje/Framework: {{techStack}} / {{framework}}
- Base de datos: {{database}}{{#if orm}} (ORM: {{orm}}){{/if}}
- Cloud/Infra: {{cloud}}
- Arquitectura: {{architecture}}{{#if events}}
- Mensajería: {{events}}{{/if}}{{#if observability}}
- Observabilidad: {{observability}}{{/if}}

## Restricciones de arquitectura
{{constraints}}{{#if security}}

## Seguridad
{{security}}{{/if}}

## Tarea
Implementa el endpoint solicitado siguiendo los patrones del proyecto existente. Incluye:
1. Validación de entrada con esquemas (zod/ajv)
2. Manejo de errores consistente con el resto de la API
3. Logging estructurado con correlationId
4. Tests unitarios y de integración
5. Documentación OpenAPI del endpoint`,
  },
  {
    id: 'refactor',
    name: 'Refactorización / Migración',
    description: 'Extraer módulos, migrar arquitectura o refactorizar código legacy con plan de rollback',
    icon: 'refactor',
    color: '#00cec9',
    category: 'backend',
    fields: [
      { id: 'projectDesc', label: 'Descripción del proyecto', type: 'textarea', suggestions: ['Monolito Rails migrando a microservicios', 'API REST legacy en PHP modernizando a Node', 'App desktop WPF migrando a web React', 'Sistema ETL on-premise migrando a cloud'], required: true },
      { id: 'techStack', label: 'Tech Stack', type: 'text', suggestions: ['Node/Express → TypeScript/NestJS', 'Python/Flask → FastAPI', 'PHP/Laravel → Node/Next.js', 'Java/Spring → Kotlin/Spring', 'Ruby/Rails → Go/Gin'], placeholder: 'Node/Express → TypeScript/NestJS', required: true },
      { id: 'goal', label: 'Objetivo de la refactorización', type: 'select', options: ['Extraer microservicio', 'Migrar base de datos', 'Actualizar framework', 'Mejorar rendimiento', 'Reducir deuda técnica', 'Migrar lenguaje'], required: true },
      { id: 'breakingChanges', label: '¿Cambios que rompen la API?', type: 'select', options: ['No, compatibilidad total', 'Sí, versionar API', 'Sí, con migración guiada'], required: true },
      { id: 'downtime', label: 'Downtime permitido', type: 'select', options: ['Zero downtime obligatorio', '< 5 minutos', '< 30 minutos', 'Ventana de mantenimiento'], required: true },
      { id: 'rollbackPlan', label: 'Plan de rollback', type: 'text', suggestions: ['Feature flags con LaunchDarkly', 'Blue/green deployment', 'Backup DB + restore automatizado', 'Canary releases al 10%', 'Shadow reads para validación'], placeholder: 'Feature flags, blue/green, backup DB...', required: true },
      { id: 'constraints', label: 'Restricciones', type: 'textarea', suggestions: ['Compatibilidad hacia atrás total', 'Migración de datos sin downtime', 'Sin cambios en esquema de BD existente', 'Rollback en < 5 minutos', 'Validación de datos post-migración'], placeholder: 'Compatibilidad hacia atrás, migración de datos, sin cambios en esquema...', required: true },
    ],
    promptTemplate: `Eres un ingeniero de software senior liderando una refactorización en {{projectDesc}}.

## Contexto técnico
- Stack actual: {{techStack}}
- Objetivo: {{goal}}
- Enfoque de compatibilidad: {{breakingChanges}}
- Downtime: {{downtime}}
- Rollback: {{rollbackPlan}}

## Restricciones
{{constraints}}

## Plan de trabajo
1. **Análisis**: Identifica dependencias, efectos colaterales y riesgos
2. **Estrategia**: Define el enfoque de migración (strangler fig, branch by abstraction, etc.)
3. **Implementación**: Código de la migración con feature flags
4. **Verificación**: Tests de regresión, comparativa de rendimiento
5. **Rollback**: Pasos concretos para revertir en producción

Genera el plan detallado y el código necesario.`,
  },
  {
    id: 'security-review',
    name: 'Security Review',
    description: 'Revisión de seguridad profunda de PRs y código generado por IA',
    icon: 'shield',
    color: '#ff6b6b',
    category: 'review',
    fields: [
      { id: 'codeContext', label: 'Contexto del código a revisar', type: 'textarea', suggestions: ['Endpoint de pagos con Stripe', 'Autenticación y registro de usuarios', 'API GraphQL pública', 'Manejo de datos médicos (HIPAA)', 'Webhook de procesador externo', 'Migración de datos sensibles'], placeholder: 'Endpoint de pagos, autenticación, manejo de datos sensibles...', required: true },
      { id: 'techStack', label: 'Tech Stack', type: 'text', suggestions: ['TypeScript + Node + PostgreSQL', 'Python + FastAPI + MongoDB', 'Go + gRPC + CockroachDB', 'Java + Spring + MySQL', 'Rust + Actix + SQLite'], placeholder: 'TypeScript, PostgreSQL, Redis...', required: true },
      { id: 'sensitivity', label: 'Nivel de sensibilidad', type: 'select', options: ['Crítico (datos financieros/salud)', 'Alto (datos personales)', 'Medio (datos internos)', 'Bajo (público)'], required: true },
      { id: 'compliance', label: 'Compliance', type: 'multiselect', options: ['PCI-DSS', 'GDPR', 'SOC2', 'HIPAA', 'ISO 27001', 'SOX'], required: false },
      { id: 'focusAreas', label: 'Áreas de enfoque', type: 'multiselect', options: ['SQL Injection', 'XSS', 'CSRF', 'Authentication', 'Authorization', 'IDOR', 'SSRF', 'RCE', 'Insecure Deserialization', 'Secrets Management', 'Rate Limiting', 'Input Validation'], required: true },
    ],
    promptTemplate: `Eres un security reviewer senior revisando {{codeContext}}.

## Contexto
- Stack: {{techStack}}
- Sensibilidad: {{sensitivity}}{{#if compliance}}
- Compliance: {{compliance}}{{/if}}

## CHECKLIST OBLIGATORIA
{{#each focusAreas}}
- [ ] {{this}}{{/each}}

Por cada hallazgo:
- BLOCKER / WARNING / INFO
- Línea exacta y archivo
- Riesgo en producción
- Fix concreto

Formato: tabla markdown con |#|Archivo|Línea|Severidad|Riesgo|Fix|`,
  },
  {
    id: 'frontend-component',
    name: 'Componente Frontend',
    description: 'Crear componentes React con estado, fetching, optimización y diseño',
    icon: 'layout',
    color: '#fdcb6e',
    category: 'frontend',
    fields: [
      { id: 'projectDesc', label: 'Descripción del proyecto', type: 'textarea', suggestions: ['Dashboard de analytics con gráficos', 'Marketplace con búsqueda y filtros', 'Sistema de chat en tiempo real', 'Formulario multi-step con validación', 'Landing page con animaciones'], required: true },
      { id: 'framework', label: 'Framework', type: 'select', options: ['React/Next.js', 'React/Vite', 'Vue/Nuxt', 'Svelte/SvelteKit', 'Solid'], required: true },
      { id: 'styling', label: 'Estilos', type: 'multiselect', options: ['Tailwind CSS', 'CSS Modules', 'Styled Components', 'Emotion', 'Vanilla Extract', 'Shadcn/ui'], required: true },
      { id: 'stateManagement', label: 'Estado global', type: 'select', options: ['React Context', 'Zustand', 'Redux Toolkit', 'Jotai', 'TanStack Query', 'Ninguno'], required: false },
      { id: 'dataFetching', label: 'Data Fetching', type: 'select', options: ['Server Components (RSC)', 'TanStack Query', 'SWR', 'useEffect + fetch', 'tRPC', 'GraphQL'], required: true },
      { id: 'responsive', label: 'Responsive', type: 'select', options: ['Mobile-first', 'Desktop-first', 'Ambos prioritarios'], required: true },
      { id: 'accessibility', label: 'Accesibilidad (WCAG)', type: 'select', options: ['Nivel AA obligatorio', 'Nivel AAA', 'Sin requisitos específicos'], required: false },
      { id: 'performance', label: 'Requisitos de rendimiento', type: 'textarea', suggestions: ['LCP < 2.5s, CLS < 0.1', 'First load JS < 100KB', 'Core Web Vitals verdes', 'Soporte offline con Service Worker', 'Carga lazy de imágenes y componentes'], placeholder: 'LCP < 2.5s, CLS < 0.1, first load < 100KB...', required: false },
      { id: 'constraints', label: 'Restricciones', type: 'textarea', suggestions: ['Sin librerías externas de UI', 'Soporte hasta IE11', 'Modo offline obligatorio', 'i18n multi-idioma', 'Tema dark/light', 'Accesibilidad WCAG AA'], placeholder: 'Sin librerías externas, soporte IE11, modo offline...', required: false },
    ],
    promptTemplate: `Eres un frontend engineer en {{projectDesc}}.

## Stack
- Framework: {{framework}}
- Estilos: {{styling}}{{#if stateManagement}}
- Estado global: {{stateManagement}}{{/if}}
- Data fetching: {{dataFetching}}
- Responsive: {{responsive}}{{#if accessibility}}
- Accesibilidad: {{accessibility}}{{/if}}{{#if performance}}
- Rendimiento: {{performance}}{{/if}}

## Restricciones
{{constraints}}

## Tarea
Implementa el componente solicitado con:
1. Estados: loading, empty, error, success, y edge cases
2. Optimización de renders (memoization)
3. Suspense boundaries y error boundaries
4. Animaciones de transición (framer-motion / CSS)
5. Tests con Testing Library y Playwright
6. Documentación del componente (props, ejemplos)`,
  },
  {
    id: 'architecture-decision',
    name: 'Architecture Decision Record (ADR)',
    description: 'Documentar decisiones arquitectónicas con contexto, trade-offs y consecuencias',
    icon: 'architecture',
    color: '#a29bfe',
    category: 'architecture',
    fields: [
      { id: 'title', label: 'Título de la decisión', type: 'text', suggestions: ['ADR-001: Migración a microservicios', 'ADR-002: Elección de base de datos', 'ADR-003: Estrategia de caching', 'ADR-004: Proveedor cloud', 'ADR-005: Framework frontend'], placeholder: 'ADR-001: Migración a microservicios', required: true },
      { id: 'context', label: 'Contexto y problema', type: 'textarea', suggestions: ['El monolito actual tiene problemas de escalabilidad (picos 5K RPM)', 'La BD actual no soporta el volumen de datos proyectado', 'El coste de infraestructura crece 30% anual sin control', 'El time-to-market es lento por acoplamiento del código'], placeholder: 'El monolito actual tiene problemas de escalabilidad...', required: true },
      { id: 'options', label: 'Opciones consideradas', type: 'textarea', suggestions: ['Opción A: Microservicios con Kafka\nOpción B: Módulos en monolitos\nOpción C: Serverless con Lambda', 'Opción A: PostgreSQL\nOpción B: CockroachDB\nOpción C: Aurora Serverless', 'Opción A: Redis + CDN\nOpción B: Varnish + Memcached\nOpción C: CloudFront + ElastiCache'], placeholder: 'Opción A: Microservicios con Kafka\nOpción B: Módulos en monolitos\nOpción C: Serverless', required: true },
      { id: 'criteria', label: 'Criterios de decisión', type: 'textarea', suggestions: ['Coste operativo (CAPEX + OPEX)', 'Escalabilidad horizontal', 'Velocidad de desarrollo', 'Complejidad operativa', 'Disponibilidad de talento', 'Vendor lock-in'], placeholder: 'Coste operativo, escalabilidad, velocidad de desarrollo, complejidad...', required: true },
      { id: 'constraints', label: 'Restricciones', type: 'textarea', suggestions: ['Presupuesto máximo $10K/mes', 'Timeline: 6 meses para producción', 'Equipo: 4 seniors + 2 juniors', 'Sistemas legacy: ERP on-premise', 'Compliance: SOC2 requerido'], placeholder: 'Presupuesto, timeline, skills del equipo, sistemas legacy...', required: true },
    ],
    promptTemplate: `# {{title}}

## Contexto
{{context}}

## Opciones Consideradas
{{options}}

## Criterios de Decisión
{{criteria}}

## Restricciones
{{constraints}}

Genera el ADR completo siguiendo el formato yad (https://github.com/joelparkerhenderson/architecture-decision-record):

# {{title}}

- **Fecha**: {{fecha}}
- **Estado**: [Propuesto | Aceptado | Reemplazado]
- **Decisor(es)**: [nombres]

## Contexto
[Contexto detallado]

## Decisión
[Decisión tomada y justificación]

## Consecuencias
- Positivas: [lista]
- Negativas: [lista]
- Riesgos: [lista con mitigaciones]

## Opciones Alternativas
[Análisis de por qué se descartaron]`,
  },
  {
    id: 'fullstack-feature',
    name: 'Feature Full-Stack Completa',
    description: 'Implementar una feature completa desde base de datos hasta UI',
    icon: 'feature',
    color: '#00b894',
    category: 'fullstack',
    fields: [
      { id: 'featureDesc', label: 'Descripción de la feature', type: 'textarea', suggestions: ['Sistema de suscripciones con pagos recurrentes', 'Dashboard de reporting con exportación CSV', 'Sistema de notificaciones push + email', 'Marketplace con reviews y ratings', 'Módulo de facturación electrónica'], placeholder: 'Sistema de suscripciones con pagos recurrentes...', required: true },
      { id: 'techStack', label: 'Tech Stack', type: 'text', suggestions: ['Next.js + Prisma + PostgreSQL + Stripe', 'Remix + Drizzle + SQLite + Paddle', 'Nuxt + Mongoose + MongoDB + MercadoPago', 'Blitz.js + Prisma + PostgreSQL + LemonSqueezy'], placeholder: 'Next.js + Prisma + PostgreSQL + Stripe', required: true },
      { id: 'scope', label: 'Alcance', type: 'multiselect', options: ['Modelo de datos (DB)', 'API endpoints', 'UI/UX', 'Integración externa', 'Background jobs', 'Webhooks', 'Tests E2E', 'Documentación'], required: true },
      { id: 'dbModel', label: 'Modelo de datos', type: 'textarea', suggestions: ['users, subscriptions, payments, invoices', 'products, categories, reviews, orders', 'projects, tasks, comments, attachments', 'organizations, teams, members, invitations'], placeholder: 'users, subscriptions, payments, invoices...', required: false },
      { id: 'integrations', label: 'Integraciones externas', type: 'text', suggestions: ['Stripe', 'PayPal', 'MercadoPago', 'SendGrid', 'Resend', 'Slack Webhooks', 'Discord Bot', 'AWS S3', 'Cloudflare R2', 'Google Sheets API'], placeholder: 'Stripe, SendGrid, Slack, AWS S3...', required: false },
      { id: 'businessRules', label: 'Reglas de negocio', type: 'textarea', suggestions: ['Un usuario puede tener max 3 suscripciones activas', 'Los pagos mayores a $1000 requieren aprobación', 'Los descuentos no pueden acumularse', 'El trial gratis es de 14 días por usuario', 'Las facturas se generan el 1ro de cada mes'], placeholder: 'Un usuario puede tener max 3 suscripciones activas...', required: true },
      { id: 'constraints', label: 'Restricciones', type: 'textarea', suggestions: ['Paginación obligatoria en listados', 'Soft-delete en todas las entidades', 'Audit logging de cambios sensibles', 'Cache de 5 min en datos públicos', 'Timeout de 30s en integraciones externas'], placeholder: 'Paginación obligatoria en listados, soft-delete...', required: false },
    ],
    promptTemplate: `Implementa la siguiente feature completa: {{featureDesc}}

## Stack
{{techStack}}

## Alcance
{{scope}}{{#if integrations}}
## Integraciones
{{integrations}}{{/if}}

## Reglas de negocio
{{businessRules}}{{#if dbModel}}

## Modelo de datos sugerido
{{dbModel}}{{/if}}{{#if constraints}}

## Restricciones
{{constraints}}{{/if}}

Genera el código completo incluyendo:
1. Esquema/modelo de base de datos
2. API endpoints
3. Componentes UI
4. Integraciones
5. Tests
6. Documentación de uso

Cada parte debe seguir los patrones existentes del proyecto.`,
  },
  {
    id: 'claude-md',
    name: 'CLAUDE.md / Contexto de Proyecto',
    description: 'Generar el archivo de contexto compartido para Claude Code, Cursor y otros agentes',
    icon: 'file',
    color: '#74b9ff',
    category: 'config',
    fields: [
      { id: 'projectName', label: 'Nombre del proyecto', type: 'text', suggestions: ['mi-app-web', 'api-backend-core', 'saas-platform', 'ecommerce-store', 'dashboard-analytics'], required: true },
      { id: 'projectType', label: 'Tipo de proyecto', type: 'select', options: ['Web App', 'API Backend', 'Librería/Package', 'CLI Tool', 'Mobile App', 'Full-stack'], required: true },
      { id: 'languages', label: 'Lenguajes principales', type: 'text', suggestions: ['TypeScript', 'Python', 'Go', 'Rust', 'Java', 'Kotlin', 'C#'], placeholder: 'TypeScript, Python, Go...', required: true },
      { id: 'framework', label: 'Framework principal', type: 'text', suggestions: ['Next.js', 'FastAPI', 'Express', 'NestJS', 'Spring Boot', 'Gin', 'Django'], placeholder: 'Next.js, FastAPI, Express...', required: true },
      { id: 'database', label: 'Base de datos', type: 'text', suggestions: ['PostgreSQL', 'PostgreSQL + Redis', 'MySQL + Redis', 'MongoDB', 'SQLite', 'CockroachDB', 'Supabase'], placeholder: 'PostgreSQL + Redis', required: false },
      { id: 'testing', label: 'Framework de testing', type: 'text', suggestions: ['vitest', 'jest', 'pytest', 'go test', 'JUnit', 'Mocha + Chai'], placeholder: 'vitest, pytest, jest...', required: false },
      { id: 'linting', label: 'Linting / Formateo', type: 'text', suggestions: ['biome', 'eslint + prettier', 'ruff', 'golangci-lint', 'clippy'], placeholder: 'biome, eslint + prettier, ruff...', required: false },
      { id: 'cicd', label: 'CI/CD', type: 'text', suggestions: ['GitHub Actions', 'GitLab CI', 'CircleCI', 'Jenkins', 'Buildkite', 'ArgoCD'], placeholder: 'GitHub Actions, GitLab CI', required: false },
      { id: 'conventions', label: 'Convenciones del equipo', type: 'textarea', suggestions: ['Conventional commits (feat:, fix:, chore:)', 'Naming: camelCase variables, PascalCase clases', 'Branch strategy: feature/nombre, hotfix/descripcion', 'Code review obligatorio con 2 approves', 'Sprint semanal con demo los viernes'], placeholder: 'Conventional commits, naming conventions, branch strategy...', required: true },
      { id: 'archPatterns', label: 'Patrones arquitectónicos', type: 'textarea', suggestions: ['Repository pattern + Service layer', 'Dependency injection con inversión de control', 'CQRS con queries y commands separados', 'Event Sourcing + Eventual Consistency', 'Hexagonal Architecture (Ports & Adapters)'], placeholder: 'Repository pattern, service layer, dependency injection...', required: false },
      { id: 'securityRules', label: 'Reglas de seguridad', type: 'textarea', suggestions: ['No hardcodear secrets (usar env vars)', 'Validar inputs con zod > joi > express-validator', 'Rate limiting por IP y endpoint', 'SQL injection: siempre prepared statements', 'XSS: sanitizar outputs, CSP headers'], placeholder: 'No hardcodear secrets, validar inputs con zod, rate limiting...', required: false },
    ],
    promptTemplate: `# {{projectName}}

## Descripción
{{projectType}} construido con {{languages}} y {{framework}}.{{#if database}}
Base de datos: {{database}}.{{/if}}

## Stack técnico
- **Lenguajes**: {{languages}}
- **Framework**: {{framework}}{{#if database}}
- **Base de datos**: {{database}}{{/if}}{{#if testing}}
- **Testing**: {{testing}}{{/if}}{{#if linting}}
- **Linting/Formateo**: {{linting}}{{/if}}{{#if cicd}}
- **CI/CD**: {{cicd}}{{/if}}

## Convenciones
{{conventions}}{{#if archPatterns}}

## Patrones arquitectónicos
{{archPatterns}}{{/if}}{{#if securityRules}}

## Reglas de seguridad
{{securityRules}}{{/if}}

## Instrucciones generales
- Escribe código limpio, legible y mantenible
- Sigue las convenciones del proyecto
- Incluye tipos/type hints siempre
- Cada función debe tener su test correspondiente
- Documenta decisiones complejas con comentarios
- Usa logging estructurado con niveles apropiados
- Maneja errores de forma consistente
- NO generes código inseguro (SQL injection, XSS, hardcoded secrets)
- Pregunta si algo no está claro antes de asumir`,
  },
  {
    id: 'db-migration',
    name: 'Migración de Base de Datos',
    description: 'Planificar y ejecutar migraciones de esquema con estrategia de rollback',
    icon: 'database',
    color: '#0984e3',
    category: 'backend',
    fields: [
      { id: 'dbEngine', label: 'Motor de BD', type: 'select', options: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'DynamoDB'], required: true },
      { id: 'changeDesc', label: 'Descripción del cambio', type: 'textarea', suggestions: ['Agregar tabla payments con foreign key a users', 'Renombrar columna status a payment_status', 'Agregar índice compuesto (user_id, created_at)', 'Migrar datos de MySQL a PostgreSQL', 'Agregar columna soft_delete a todas las tablas'], placeholder: 'Agregar tabla payments, renombrar columna status...', required: true },
      { id: 'dataVolume', label: 'Volumen de datos', type: 'select', options: ['< 10K registros', '10K - 1M', '1M - 100M', '> 100M'], required: true },
      { id: 'downtime', label: 'Downtime permitido', type: 'select', options: ['Zero downtime', '< 1 minuto', '< 5 minutos', '< 30 minutos'], required: true },
      { id: 'rollbackStrategy', label: 'Estrategia de rollback', type: 'select', options: ['Migración reversible (up/down)', 'Snapshot previo', 'Feature flags', 'Blue/green'], required: true },
      { id: 'constraints', label: 'Restricciones', type: 'textarea', placeholder: 'Foreign keys, check constraints, índices concurrentes...', required: false },
    ],
    promptTemplate: `Planifica y genera la migración para: {{changeDesc}}

## Contexto
- Motor: {{dbEngine}}
- Volumen: {{dataVolume}}
- Downtime máximo: {{downtime}}
- Rollback: {{rollbackStrategy}}{{#if constraints}}
- Restricciones: {{constraints}}{{/if}}

## Requisitos
1. Migración UP completa con validaciones
2. Migración DOWN para rollback
3. Script de verificación post-migración
4. Estrategia de despliegue (expuesta abajo)
5. Monitoreo post-migración (qué métricas observar)

## Formato
Genera:
- archivo .up.sql (migración forward)
- archivo .down.sql (rollback)
- verify.sql (queries de verificación)
- NOTES.md (consideraciones de despliegue)`,
  },
  {
    id: 'infra-code',
    name: 'Infraestructura como Código',
    description: 'Generar configuraciones de infraestructura (Terraform, Docker, K8s, CI/CD)',
    icon: 'cloud',
    color: '#636e72',
    category: 'devops',
    fields: [
      { id: 'serviceDesc', label: 'Descripción del servicio', type: 'textarea', suggestions: ['API REST con auto-scaling en EKS', 'Worker de procesamiento de imágenes', 'CDN + WAF para sitio estático', 'Base de datos PostgreSQL multi-AZ', 'Cola de mensajes con RabbitMQ en K8s'], required: true },
      { id: 'provider', label: 'Proveedor cloud', type: 'select', options: ['AWS', 'GCP', 'Azure', 'Multi-cloud', 'On-premise'], required: true },
      { id: 'infraTool', label: 'Herramienta', type: 'multiselect', options: ['Terraform', 'Pulumi', 'CloudFormation', 'Kubernetes', 'Docker Compose', 'Ansible'], required: true },
      { id: 'services', label: 'Servicios a desplegar', type: 'textarea', suggestions: ['API Gateway + Lambda + RDS', 'EKS cluster + ALB + RDS multi-AZ', 'CloudFront + S3 + Lambda@Edge', 'ECS Fargate + ElastiCache + RDS'], placeholder: 'API, worker, DB, cache, CDN, cola de mensajes...', required: true },
      { id: 'networking', label: 'Requisitos de red', type: 'text', suggestions: ['VPC con subnets públicas y privadas', 'Application Load Balancer + WAF', 'CDN con CloudFront + SSL', 'VPN site-to-site con on-premise', 'PrivateLink para servicios AWS'], placeholder: 'VPC, subnets, load balancer, WAF, CDN...', required: false },
      { id: 'scaling', label: 'Escalado', type: 'select', options: ['Auto-scaling por CPU/memoria', 'Escalado manual', 'Sin escalado'], required: true },
      { id: 'security', label: 'Seguridad', type: 'textarea', suggestions: ['IAM roles con mínimo privilegio', 'Secrets Manager para credenciales', 'Encryption at rest (KMS) + en tránsito (TLS)', 'Security Groups con reglas restrictivas', 'WAF + Shield para protección DDoS'], placeholder: 'IAM roles, secrets manager, encryption at rest/en tránsito...', required: false },
      { id: 'cost', label: 'Restricciones de coste', type: 'text', suggestions: ['Budget mensual máximo $5K', 'Usar instancias spot para workers', 'Evitar NAT Gateway (usar VPC endpoints)', 'Reserved instances para cargas base', 'Auto-scaling para reducir en horas valle'], placeholder: 'Budget mensual, instancias spot, evitar servicios caros...', required: false },
    ],
    promptTemplate: `Define la infraestructura para: {{serviceDesc}}

## Contexto
- Proveedor: {{provider}}
- Herramientas: {{infraTool}}
- Servicios: {{services}}{{#if networking}}
- Red: {{networking}}{{/if}}
- Escalado: {{scaling}}{{#if security}}
- Seguridad: {{security}}{{/if}}{{#if cost}}
- Coste: {{cost}}{{/if}}

## Requisitos
1. Configuración completa de infraestructura
2. Estrategia de high availability y disaster recovery
3. Políticas de backup y retention
4. Monitoreo y alertas
5. Cost estimation
6. Documentación de arquitectura de infra

Genera el código de infraestructura completo con variables de entorno, secrets management y CI/CD integration.`,
  },
]

export function getTemplateById(id: string): PromptTemplate | undefined {
  return templates.find(t => t.id === id)
}

export const categories = [
  { id: 'backend', name: 'Backend', icon: 'server' },
  { id: 'frontend', name: 'Frontend', icon: 'layout' },
  { id: 'fullstack', name: 'Full-Stack', icon: 'feature' },
  { id: 'architecture', name: 'Arquitectura', icon: 'architecture' },
  { id: 'review', name: 'Revisión', icon: 'shield' },
  { id: 'devops', name: 'DevOps', icon: 'cloud' },
  { id: 'config', name: 'Configuración', icon: 'file' },
]
