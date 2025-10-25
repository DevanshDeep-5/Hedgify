import { useState, useEffect } from 'react'
import api from '../services/api'

function Alerts({ user }) {
  const [alerts, setAlerts] = useState([])
  const [crops, setCrops] = useState([])
  const [formData, setFormData] = useState({ cropId: '', alertType: 'above', thresholdPrice: '' })

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    const [alertsRes, cropsRes] = await Promise.all([
      api.getUserAlerts(user.id),
      api.getCrops()
    ])
    setAlerts(alertsRes.data)
    setCrops(cropsRes.data)
    if (cropsRes.data.length > 0) {
      setFormData(prev => ({ ...prev, cropId: cropsRes.data[0].id }))
    }
  }

  const handleCreateAlert = async (e) => {
    e.preventDefault()
    try {
      await api.createAlert({ userId: user.id, ...formData })
      setFormData({ ...formData, thresholdPrice: '' })
      loadData()
      alert('Alert created successfully!')
    } catch (error) {
      alert('Error creating alert')
    }
  }

  const handleDeleteAlert = async (alertId) => {
    if (confirm('Delete this alert?')) {
      await api.deleteAlert(alertId)
      loadData()
    }
  }

  return (
    <div className="container">
      <h1>Price Alerts</h1>
      
      <div className="card">
        <h2>Create New Alert</h2>
        <form onSubmit={handleCreateAlert}>
          <div className="form-group">
            <label>Crop</label>
            <select value={formData.cropId} onChange={(e) => setFormData({...formData, cropId: e.target.value})}>
              {crops.map(crop => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Alert When Price Goes</label>
            <select value={formData.alertType} onChange={(e) => setFormData({...formData, alertType: e.target.value})}>
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>

          <div className="form-group">
            <label>Threshold Price (₹)</label>
            <input
              type="number"
              value={formData.thresholdPrice}
              onChange={(e) => setFormData({...formData, thresholdPrice: e.target.value})}
              required
            />
          </div>

          <button type="submit">Create Alert</button>
        </form>
      </div>

      <div className="card">
        <h2>My Alerts</h2>
        {alerts.length === 0 ? (
          <p>No alerts set. Create one above!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Type</th>
                <th>Threshold</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map(alert => (
                <tr key={alert.id}>
                  <td>{alert.crop_name}</td>
                  <td>{alert.alert_type}</td>
                  <td>₹{alert.threshold_price}</td>
                  <td>
                    <span className={`badge ${alert.is_active ? 'success' : 'danger'}`}>
                      {alert.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(alert.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDeleteAlert(alert.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Alerts
