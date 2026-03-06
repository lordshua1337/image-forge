import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiToken = process.env.REPLICATE_API_TOKEN
  if (!apiToken) {
    return NextResponse.json(
      { error: 'AI generation is not configured. Add REPLICATE_API_TOKEN to enable.', demo: true },
      { status: 503 }
    )
  }

  const body = await request.json()
  const { prompt, aspectRatio = '1:1' } = body

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  // Call Replicate Flux Schnell (fast model)
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'black-forest-labs/flux-schnell',
      input: {
        prompt: prompt.trim(),
        aspect_ratio: aspectRatio,
        num_outputs: 1,
        output_format: 'webp',
        output_quality: 90,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json(
      { error: `Replicate API error: ${response.status}` },
      { status: 502 }
    )
  }

  const prediction = await response.json()

  // Poll for completion (Flux Schnell is usually <5s)
  let result = prediction
  let attempts = 0
  while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < 30) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { 'Authorization': `Bearer ${apiToken}` },
    })
    result = await pollRes.json()
    attempts++
  }

  if (result.status === 'failed') {
    return NextResponse.json({ error: 'Image generation failed' }, { status: 500 })
  }

  const imageUrl = result.output?.[0] || result.output
  if (!imageUrl) {
    return NextResponse.json({ error: 'No image generated' }, { status: 500 })
  }

  return NextResponse.json({ imageUrl, prompt: prompt.trim() })
}
