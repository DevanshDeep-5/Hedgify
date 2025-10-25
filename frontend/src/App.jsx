import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Prices from './pages/Prices'
import Trading from './pages/Trading'
import Contracts from './pages/Contracts'
import Alerts from './pages/Alerts'
import Education from './pages/Education'
import Login from './pages/Login'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <div className="nav-container">
            <h1>🌾 Oilseed Hedging Platform</h1>
            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/prices">Prices</Link>
              <Link to="/trading">Trading</Link>
              <Link to="/contracts">Contracts</Link>
              <Link to="/alerts">Alerts</Link>
              <Link to="/education">Education</Link>
              <button onClick={handleLogout} style={{marginLeft: '10px'}}>Logout</button>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/trading" element={<Trading user={user} />} />
          <Route path="/contracts" element={<Contracts user={user} />} />
          <Route path="/alerts" element={<Alerts user={user} />} />
          <Route path="/education" element={<Education />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
