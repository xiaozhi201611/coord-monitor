import { kv } from '@vercel/kv'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const allData = await kv.hgetall('clients') || {}
    const clients = []
    const now = Date.now()

    for (const [clientId, dataStr] of Object.entries(allData)) {
      try {
        const data = JSON.parse(dataStr)
        const isOnline = (now - (data.last_seen || 0)) < 60000
        clients.push({ ...data, connected: isOnline })
      } catch(e) {}
    }

    clients.sort((a, b) => {
      if (a.connected !== b.connected) return a.connected ? -1 : 1
      return (b.last_seen || 0) - (a.last_seen || 0)
    })

    return Response.json({
      clients,
      total: clients.length,
      online: clients.filter(c => c.connected).length
    })
    
  } catch (e) {
    return Response.json({ clients: [], total: 0, online: 0 })
  }
}
