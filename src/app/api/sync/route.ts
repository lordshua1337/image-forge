import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/auth/server'
import { adminClient } from '@/lib/supabase/client'
import { z } from 'zod'

const syncPushSchema = z.object({
  designs: z.array(z.object({
    name: z.string().min(1),
    template_id: z.string().optional(),
    canvas_state: z.record(z.string(), z.unknown()),
  })).optional(),
  brand_kits: z.array(z.object({
    name: z.string().min(1),
    colors: z.array(z.string()).optional(),
    fonts: z.array(z.string()).optional(),
  })).optional(),
})

export async function GET() {
  const user = await requireUser()

  const [designsRes, kitsRes, assetsRes] = await Promise.all([
    adminClient.from('designs').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
    adminClient.from('brand_kits').select('*').eq('user_id', user.id),
    adminClient.from('assets').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
  ])

  return NextResponse.json({
    designs: designsRes.data ?? [],
    brand_kits: kitsRes.data ?? [],
    assets: assetsRes.data ?? [],
  })
}

export async function POST(request: Request) {
  const user = await requireUser()
  const body = await request.json()
  const parsed = syncPushSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid sync data', details: parsed.error.flatten() }, { status: 400 })
  }

  const results: Record<string, number> = {}

  if (parsed.data.designs?.length) {
    const rows = parsed.data.designs.map((d) => ({
      user_id: user.id,
      name: d.name,
      template_id: d.template_id ?? null,
      canvas_state: d.canvas_state,
    }))
    await adminClient.from('designs').insert(rows)
    results.designs = rows.length
  }

  if (parsed.data.brand_kits?.length) {
    const rows = parsed.data.brand_kits.map((k) => ({
      user_id: user.id,
      name: k.name,
      colors: k.colors ?? [],
      fonts: k.fonts ?? [],
    }))
    await adminClient.from('brand_kits').insert(rows)
    results.brand_kits = rows.length
  }

  return NextResponse.json({ synced: results })
}
