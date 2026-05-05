import { kv } from '@vercel/kv'

export async function POST(request) {
  try {
    const body = await request.json()
    
    if (!body.clientId || !body.username) {
      return Response.json({ error: '缺少必要字段' }, { status: 400 })
    }

    const clientId = body.clientId
    const now = Date.now()

    const clientData = {
      clientId,
      username: body.username,
      connected: true,
      last_seen: now,
      first_seen: body.first_seen || now,
      last_pos: {
        x: body.x || 0,
        y: body.y || 0,
        z: body.z || 0,
        dimension: body.dimension ?? 0,
        health: body.health || 20,
        hunger: body.hunger || 20,
        server: body.server || '未知服务器',
        serverIp: body.serverIp || '',
        timestamp: now
      }
    }

    await kv.hset('clients', { [clientId]: JSON.stringify(clientData) })
    await kv.sadd('online_clients', clientId)

    return Response.json({ status: 'ok', time: now })
    
  } catch (e) {
    console.error('上报错误:', e)
    return Response.json({ error: '服务器错误' }, { status: 500 })
  }
}
