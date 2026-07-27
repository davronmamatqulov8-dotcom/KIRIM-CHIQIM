import { NextResponse } from 'next/server'

const SUPABASE_URL = 'https://nfvxjgrodcohsrgfnmtz.supabase.co'

async function proxyRequest(request, { params }) {
  try {
    const path = (await params).path.join('/')
    const url = new URL(request.url)
    const targetUrl = `${SUPABASE_URL}/${path}${url.search}`

    // So'rov headerlarini ko'chiramiz
    const headers = new Headers()
    for (const [key, value] of request.headers.entries()) {
      if (!['host', 'connection', 'transfer-encoding'].includes(key.toLowerCase())) {
        headers.set(key, value)
      }
    }
    headers.set('host', 'nfvxjgrodcohsrgfnmtz.supabase.co')

    const hasBody = !['GET', 'HEAD'].includes(request.method)
    const body = hasBody ? await request.arrayBuffer() : undefined

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body?.byteLength ? body : undefined,
      redirect: 'manual', // Redirectlarni qo'lda boshqaramiz
    })

    // Javob headerlarini ko'chiramiz
    const resHeaders = new Headers()
    for (const [key, value] of response.headers.entries()) {
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        // Supabase redirect URL'larini proxy URL ga o'zgartirish
        if (key.toLowerCase() === 'location') {
          resHeaders.set(key, value.replace(SUPABASE_URL, ''))
        } else {
          resHeaders.set(key, value)
        }
      }
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: resHeaders,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req, ctx) { return proxyRequest(req, ctx) }
export async function POST(req, ctx) { return proxyRequest(req, ctx) }
export async function PUT(req, ctx) { return proxyRequest(req, ctx) }
export async function PATCH(req, ctx) { return proxyRequest(req, ctx) }
export async function DELETE(req, ctx) { return proxyRequest(req, ctx) }
export async function OPTIONS(req, ctx) { return proxyRequest(req, ctx) }
