import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../services/api'

function Prices() {
  const [crops, setCrops] = useState([])
  const [selectedCrop, setSelectedCrop] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCrops()
  }, [])

  const loadCrops = async () => {
    try {
      const response = await api.getCrops()
      setCrops(response.data)
      if (response.data.length > 0) {
        handleCropSelect(response.data[0].id)
      }
    } catch (error) {
      console.error('Error loading crops:', error)
    }
  }

  const handleCropSelect = async (cropId) => {
    setSelectedCrop(cropId)
    setLoading(true)
    try {
      const [historyRes, predictionRes] = await Promise.all([
        api.getPriceHistory(cropId, 30),
        api.getPrediction(cropId, 7)
      ])
      setPriceHistory(historyRes.data.reverse())
      setPrediction(predictionRes.data)
    } catch (error) {
      console.error('Error loading price data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = priceHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    price: item.price
  }))

  return (
    <div className="container">
      <h1>Price Analysis & Predictions</h1>
      
      <div className="card">
        <h2>Select Crop</h2>
        <select 
          value={selectedCrop || ''} 
          onChange={(e) => handleCropSelect(Number(e.target.value))}
          style={{ maxWidth: '300px' }}
        >
          {crops.map(crop => (
            <option key={crop.id} value={crop.id}>{crop.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="card">Loading...</div>
      ) : (
        <>
          {prediction && (
            <div className="card">
              <h2>Market Indicators</h2>
              <div className="grid">
                <div>
                  <strong>Current Price:</strong> ₹{prediction.currentPrice}
                </div>
                <div>
                  <strong>7-Day SMA:</strong> ₹{prediction.indicators?.sma7}
                </div>
                <div>
                  <strong>14-Day SMA:</strong> ₹{prediction.indicators?.sma14}
                </div>
                <div>
                  <strong>Trend:</strong> {prediction.indicators?.trend}
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <h2>Price History (Last 30 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#2c5f2d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {prediction && prediction.predictions && (
            <div className="card">
              <h2>Price Prediction (Next 7 Days)</h2>
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Predicted Price</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {prediction.predictions.map((pred) => (
                    <tr key={pred.day}>
                      <td>Day {pred.day}</td>
                      <td>₹{pred.price}</td>
                      <td>
                        <span className={`badge ${pred.confidence > 0.8 ? 'success' : pred.confidence > 0.6 ? 'warning' : 'danger'}`}>
                          {(pred.confidence * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="alert info" style={{ marginTop: '15px' }}>
                <strong>Note:</strong> Predictions are based on historical data and technical indicators. 
                Actual prices may vary due to market conditions.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Prices
