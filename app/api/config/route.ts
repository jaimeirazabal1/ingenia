import { NextRequest, NextResponse } from 'next/server'
import { getConfig, setConfig, deleteConfig } from '../../../lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })
  const value = getConfig(key)
  return NextResponse.json({ key, value })
}

export async function POST(req: NextRequest) {
  const { key, value } = await req.json()
  if (!key || value === undefined) return NextResponse.json({ error: 'Missing key/value' }, { status: 400 })
  setConfig(key, value)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 })
  deleteConfig(key)
  return NextResponse.json({ success: true })
}
