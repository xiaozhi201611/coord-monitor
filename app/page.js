'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    try {
      const res = await fetch('/api/positions')
      const data = await res.json()
      setClients(data.clients || [])
    } catch(e) {}
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const timer = setInterval(fetchData, 2000)
    return () => clearInterval(timer)
  }, [])

  function getDimName(dim) {
    if (dim === -1) return '🔥 地狱'
    if (dim === 0) return '🌍 主世界'
    if (dim === 1) return '🌌 末地'
    return '❓ 未知'
  }

  return (
    <div style={{
      background: '#0a0a0a', color: '#00ff00',
      fontFamily: 'monospace', minHeight: '100vh',
      padding: '12px', paddingBottom: '60px'
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '2px solid #00ff00',
        paddingBottom: '10px', marginBottom: '12px'
      }}>
        <div>
          <span style={{ fontSize: '22px', fontWeight: 'bold' }}>📍 坐标监控</span>
          <span style={{ fontSize: '12px', color: '#888', marginLeft: '8px' }}>
            在线: <span style={{ color: '#0f0' }}>{clients.filter(c => c.connected).length}</span>
            / 总计: {clients.length}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#555' }}>
          {new Date().toLocaleTimeString()}
        </span>
      </div>

      {loading && <div style={{ textAlign: 'center', color: '#555', marginTop: '60px' }}>⌛ 加载中...</div>}

      {!loading && clients.length === 0 && (
        <div style={{ textAlign: 'center', color: '#555', marginTop: '60px' }}>
          ⌛ 等待客户端连接...<br/>
          <span style={{ fontSize: '12px' }}>确保有人在使用你的客户端</span>
        </div>
      )}

      {clients.map((c, i) => {
        const pos = c.last_pos
        const isOnline = c.connected
        const dist2 = pos ? Math.sqrt(Math.pow(pos.x - 2, 2) + Math.pow(pos.z - 2, 2)).toFixed(1) : '?'

        return (
          <div key={c.clientId || i} style={{
            background: isOnline ? '#111' : '#0a0a0a',
            border: `1.5px solid ${isOnline ? '#00ff00' : '#333'}`,
            borderRadius: '8px', padding: '10px 12px',
            marginBottom: '8px', opacity: isOnline ? 1 : 0.4
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                {isOnline ? '🟢' : '🔴'} {c.username || '?'}
              </span>
              <span style={{ fontSize: '10px', color: '#555' }}>{c.clientId}</span>
            </div>

            {pos && (
              <div style={{
                background: '#002200', padding: '4px 8px',
                borderRadius: '4px', marginBottom: '6px',
                fontSize: '14px', color: '#0ff', fontWeight: 'bold'
              }}>
                🎮 {pos.server || '未知服务器'}
              </div>
            )}

            {pos ? (
              <div style={{
                fontSize: '20px', color: '#ffff00',
                background: '#1a1a00', padding: '6px 8px',
                borderRadius: '4px', marginBottom: '6px',
                fontWeight: 'bold'
              }}>
                X {pos.x.toFixed(1)}　Y {pos.y.toFixed(1)}　Z {pos.z.toFixed(1)}
              </div>
            ) : (
              <div style={{ color: '#555', marginBottom: '6px' }}>⌛ 等待坐标...</div>
            )}

            {pos && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 10px', fontSize: '12px', color: '#888' }}>
                <div>维度：<span style={{ color: pos.dimension === -1 ? '#f44' : pos.dimension === 0 ? '#4a4' : '#a4f' }}>{getDimName(pos.dimension)}</span></div>
                <div>血量：<span style={{ color: '#f44' }}>{pos.health?.toFixed(0)} ❤️</span></div>
                {dist2 !== '?' && (
                  <div style={{ gridColumn: 'span 2', color: '#ffaa00', marginTop: '2px' }}>
                    📍 距离 (2,2) 点：<b>{dist2}</b> m
                  </div>
                )}
              </div>
            )}

            <div style={{ fontSize: '10px', color: '#444', marginTop: '6px', textAlign: 'right' }}>
              {pos?.timestamp ? new Date(pos.timestamp).toLocaleString() : '--'}
            </div>
          </div>
        )
      })}
    </div>
  )
            }
