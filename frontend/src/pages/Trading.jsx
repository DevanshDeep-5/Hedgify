import { useState, useEffect } from 'react'
import api from '../services/api'

function Trading({ user }) {
  const [crops, setCrops] = useState([])
  const [formData, setFormData] = useState({
    cropId: '',
    contractType: 'long',
    quantity: '',
    strikePrice: '',
    expiryDate: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadCrops()
  }, [])

  const loadCrops = async () => {
    const response = await api.getCrops()
    setCrops(response.data)
    if (response.data.length > 0) {
      setFormData(prev => ({ ...prev, cropId: response.data[0].id }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.createContract({
        userId: user.id,
        ...formData
      })
      setMessage('Contract created successfully!')
      setFormData({ ...formData, quantity: '', strikePrice: '', expiryDate: '' })
    } catch (error) {
      setMessage('Error creating contract: ' + error.message)
    }
  }

  return (
    <div className="container">
      <h1>Virtual Trading</h1>
      
      <div className="card">
        <h2>Create New Hedge Contract</h2>
        {message && <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Crop</label>
            <select value={formData.cropId} onChange={(e) => setFormData({...formData, cropId: e.target.value})}>
              {crops.map(crop => <option key={crop.id} value={crop.id}>{crop.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Contract Type</label>
            <select value={formData.contractType} onChange={(e) => setFormData({...formData, contractType: e.target.value})}>
              <option value="long">Long (Buy Future)</option>
              <option value="short">Short (Sell Future)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity (quintals)</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Strike Price (₹ per quintal)</label>
            <input
              type="number"
              value={formData.strikePrice}
              onChange={(e) => setFormData({...formData, strikePrice: e.target.value})}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              required
            />
          </div>

          <button type="submit">Create Contract</button>
        </form>
      </div>

      <div className="alert info">
        <strong>How it works:</strong><br />
        • Long position: Profit if price goes UP<br />
        • Short position: Profit if price goes DOWN<br />
        • Monitor your positions in the Contracts page
      </div>
    </div>
  )
}

export default Trading
