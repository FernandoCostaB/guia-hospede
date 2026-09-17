import { NextRequest, NextResponse } from 'next/server'
import { findPropertyByCode } from '@/server/repositories/property-repository'
import { getOrGenerateGuide } from '@/server/services/experience-service'
import type { Property } from '@/types/property'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const property = await findPropertyByCode(code.toUpperCase())
  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 })
  }

  const result = await getOrGenerateGuide(property as unknown as Property)
  return NextResponse.json(result)
}
