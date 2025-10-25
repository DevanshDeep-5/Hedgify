import { useState, useEffect } from 'react'
import api from '../services/api'

function Dashboard({ user }) {
  const [stats, setStats] = useState(null)
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [statsRes, pricesRes] = await Promise.all([
        api.getContractStats(user.id),
        api.getCurrentPrices()
      ])
      setStats(statsRes.data)
      setPrices(pricesRes.data)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <h1>Welcome, {user.name}!</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Track your hedging positions and market insights
      </p>

      <div className="grid">
        <div className="stat-card">
          <h3>Total Contracts</h3>
          <div className="value">{stats?.total_contracts || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Active Positions</h3>
          <div className="value">{stats?.active_contracts || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total P&L</h3>
          <div className="value">₹{Math.round(stats?.total_pnl || 0)}</div>
        </div>
        <div className="stat-card">
          <h3>Average P&L</h3>
          <div className="value">₹{Math.round(stats?.avg_pnl || 0)}</div>
        </div>
      </div>

      <div className="card">
        <h2>Current Market Prices</h2>
        <table>
          <thead>
            <tr>
              <th>Crop</th>
              <th>Current Price</th>
              <th>Market</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr key={price.id}>
                <td>{price.name}</td>
                <td>₹{price.price ? price.price.toFixed(2) : 'N/A'} / quintal</td>
                <td>{price.market || 'NCDEX'}</td>
                <td>{price.date ? new Date(price.date).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="alert info">
        <strong>💡 Quick Tip:</strong> Monitor price trends and set alerts to make informed hedging decisions. 
        Visit the Education section to learn more about risk management strategies.
      </div>
    </div>
  )
}

export default Dashboard
