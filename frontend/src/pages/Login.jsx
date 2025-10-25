import { useState } from 'react'
import api from '../services/api'

function Login({ onLogin }) {
  const [email, setEmail] = useState('demo@farmer.com')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.login({ email, password })
      onLogin(response.data.user)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2c5f2d 0%, #4a8c4f 100%)'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
          🌾 Oilseed Hedging Platform
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>
          Login to manage your hedging strategies
        </p>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="demo@farmer.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="demo123"
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="alert info" style={{ marginTop: '20px' }}>
          <strong>Demo Credentials:</strong><br />
          Email: demo@farmer.com<br />
          Password: demo123
        </div>
      </div>
    </div>
  )
}

export default Login
