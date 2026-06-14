import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DATA_DIR, 'devforge.db')

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'devforge-default-key-change-in-production'

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
}

let _db: Database.Database | null = null

function getDb(): Database.Database {
  if (!_db) {
    ensureDir()
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    initSchema()
  }
  return _db
}

function initSchema() {
  _db!.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      key_encrypted TEXT NOT NULL,
      label TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS prompt_history (
      id TEXT PRIMARY KEY,
      module TEXT NOT NULL,
      provider TEXT,
      model TEXT,
      prompt TEXT NOT NULL,
      system_prompt TEXT,
      result TEXT,
      tokens_used INTEGER,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS app_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `)
}

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv('aes-256-cbc',
    crypto.createHash('sha256').update(ENCRYPTION_KEY).digest(),
    crypto.createHash('md5').update(ENCRYPTION_KEY).digest()
  )
  let enc = cipher.update(text, 'utf8', 'hex')
  enc += cipher.final('hex')
  return enc
}

function decrypt(encrypted: string): string {
  const decipher = crypto.createDecipheriv('aes-256-cbc',
    crypto.createHash('sha256').update(ENCRYPTION_KEY).digest(),
    crypto.createHash('md5').update(ENCRYPTION_KEY).digest()
  )
  let dec = decipher.update(encrypted, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

// API Keys CRUD
export function saveApiKey(id: string, provider: string, key: string, label?: string) {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO api_keys (id, provider, key_encrypted, label)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      provider = excluded.provider,
      key_encrypted = excluded.key_encrypted,
      label = excluded.label,
      updated_at = datetime('now')
  `)
  stmt.run(id, provider, encrypt(key), label || null)
}

export function getApiKeys(): { id: string; provider: string; label: string | null; is_active: number }[] {
  const db = getDb()
  const rows = db.prepare('SELECT id, provider, label, is_active FROM api_keys ORDER BY created_at DESC').all() as any[]
  return rows
}

export function getApiKey(id: string): string | null {
  const db = getDb()
  const row = db.prepare('SELECT key_encrypted FROM api_keys WHERE id = ? AND is_active = 1').get(id) as any
  if (!row) return null
  return decrypt(row.key_encrypted)
}

export function deleteApiKey(id: string) {
  const db = getDb()
  db.prepare('DELETE FROM api_keys WHERE id = ?').run(id)
}

// Prompt History CRUD
export function savePromptHistory(id: string, module: string, prompt: string, systemPrompt: string, result: string, provider?: string, model?: string, tokensUsed?: number) {
  const db = getDb()
  db.prepare(`
    INSERT INTO prompt_history (id, module, provider, model, prompt, system_prompt, result, tokens_used)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, module, provider || null, model || null, prompt, systemPrompt, result, tokensUsed || null)
}

export function getPromptHistory(module?: string, limit = 50, offset = 0) {
  const db = getDb()
  let query = 'SELECT * FROM prompt_history'
  const params: any[] = []
  if (module) { query += ' WHERE module = ?'; params.push(module) }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
  params.push(limit, offset)
  return db.prepare(query).all(...params) as any[]
}

export function deletePromptHistory(id: string) {
  const db = getDb()
  db.prepare('DELETE FROM prompt_history WHERE id = ?').run(id)
}

// App Config
export function getConfig(key: string): string | null {
  const db = getDb()
  const row = db.prepare('SELECT value FROM app_config WHERE key = ?').get(key) as any
  return row ? row.value : null
}

export function setConfig(key: string, value: string) {
  const db = getDb()
  db.prepare(`
    INSERT INTO app_config (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
  `).run(key, value)
}

export function deleteConfig(key: string) {
  const db = getDb()
  db.prepare('DELETE FROM app_config WHERE key = ?').run(key)
}

export function closeDb() {
  if (_db) { _db.close(); _db = null }
}
