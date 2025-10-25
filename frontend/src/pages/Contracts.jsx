import { useState, useEffect } from 'react'
import api from '../services/api'

function Contracts({ user }) {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContracts()
  }, [user])

  const loadContracts = async () => {
    try {
      const response = await api.getUserContracts(user.id)
      setContracts(response.data)
    } catch (error) {
      console.error('Error loading contracts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseContract = async (contractId, strikePrice) => {
    const currentPrice = prompt(`Enter current price to close contract (Strike price: ₹${strikePrice}):`)
    if (currentPrice) {
      try {
        await api.closeContract(contractId, parseFloat(currentPrice))
        alert('Contract closed successfully!')
        loadContracts()
      } catch (error) {
        alert('Error closing contract: ' + error.message)
      }
    }
  }

  if (loading) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <h1>My Contracts</h1>
      
      <div className="card">
        <h2>Active & Closed Positions</h2>
        {contracts.length === 0 ? (
          <p>No contracts yet. Start trading to create your first hedge!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crop</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Strike Price</th>
                <th>Current Price</th>
                <th>P&L</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr key={contract.id}>
                  <td>{contract.crop_name}</td>
                  <td>
                    <span className={`badge ${contract.contract_type === 'long' ? 'success' : 'warning'}`}>
                      {contract.contract_type.toUpperCase()}
                    </span>
                  </td>
                  <td>{contract.quantity} {contract.unit}</td>
                  <td>₹{contract.strike_price}</td>
                  <td>₹{contract.current_price || '-'}</td>
                  <td style={{ color: contract.pnl > 0 ? 'green' : contract.pnl < 0 ? 'red' : 'black' }}>
                    ₹{contract.pnl ? contract.pnl.toFixed(2) : '0.00'}
                  </td>
                  <td>
                    <span className={`badge ${contract.status === 'active' ? 'success' : 'danger'}`}>
                      {contract.status}
                    </span>
                  </td>
                  <td>{new Date(contract.expiry_date).toLocaleDateString()}</td>
                  <td>
                    {contract.status === 'active' && (
                      <button onClick={() => handleCloseContract(contract.id, contract.strike_price)}>
                        Close
                      </button>
                    )}
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

export default Contracts
