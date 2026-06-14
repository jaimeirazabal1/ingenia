import { NextRequest, NextResponse } from 'next/server'
import { savePromptHistory, getPromptHistory, deletePromptHistory } from '../../../lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const module = searchParams.get('module') || undefined
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  return NextResponse.json(getPromptHistory(module, limit, offset))
}

export async function POST(req: NextRequest) {
  const { id, module, prompt, system_prompt, result, provider, model, tokens_used } = await req.json()
  if (!id || !module || !prompt) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  savePromptHistory(id, module, prompt, system_prompt || '', result || '', provider, model, tokens_used)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  deletePromptHistory(id)
  return NextResponse.json({ success: true })
}
