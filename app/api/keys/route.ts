import { NextRequest, NextResponse } from 'next/server'
import { saveApiKey, getApiKeys, getApiKey, deleteApiKey } from '../../../lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id) {
    const key = getApiKey(id)
    if (!key) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ id, key })
  }
  return NextResponse.json(getApiKeys())
}

export async function POST(req: NextRequest) {
  const { id, provider, key, label } = await req.json()
  if (!id || !provider || !key) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  saveApiKey(id, provider, key, label)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  deleteApiKey(id)
  return NextResponse.json({ success: true })
}
