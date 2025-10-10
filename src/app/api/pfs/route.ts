import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url, payload }: { url: string; payload: unknown } = await request.json()
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Missing url' }, { status: 400 })
    }
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload ?? {}),
      // Prevent Next from caching CMS responses
      cache: 'no-store',
    })
    const data = await resp.json().catch(() => ({}))
    return NextResponse.json(data, { status: resp.status })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Proxy error' },
      { status: 500 },
    )
  }
}

export const dynamic = 'force-dynamic'

// Simple proxy to CMS PFS DKAN GET endpoint to avoid CORS from the browser
export const GET = async (req: NextRequest) => {
  try {
    const datasetUrl = process.env.NEXT_PUBLIC_PFS_DATASET_URL
    if (!datasetUrl) {
      return NextResponse.json({ error: 'PFS dataset URL not configured' }, { status: 500 })
    }

    // Reconstruct target URL with incoming query string
    const target = new URL(datasetUrl)
    const incoming = new URL(req.url)
    incoming.searchParams.forEach((value, key) => target.searchParams.set(key, value))

    const upstream = await fetch(target.toString(), { headers: { Accept: 'application/json' } })
    const data = await upstream.json()
    const res = NextResponse.json(data, { status: upstream.status })
    res.headers.set('Access-Control-Allow-Origin', '*')
    return res
  } catch (err) {
    return NextResponse.json({ error: 'Proxy error', message: String(err) }, { status: 500 })
  }
}
