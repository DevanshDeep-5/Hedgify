function Education() {
  return (
    <div className="container">
      <h1>Risk Management Education</h1>
      
      <div className="card">
        <h2>What is Hedging?</h2>
        <p>
          Hedging is a risk management strategy used to offset potential losses in one investment by making another. 
          In agriculture, farmers use hedging to protect themselves against price fluctuations in commodity markets.
        </p>
      </div>

      <div className="card">
        <h2>Understanding Futures Contracts</h2>
        <p>
          A futures contract is an agreement to buy or sell a commodity at a predetermined price at a specified time in the future.
        </p>
        <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
          <li><strong>Long Position:</strong> You agree to BUY at a future date. Profit if prices rise.</li>
          <li><strong>Short Position:</strong> You agree to SELL at a future date. Profit if prices fall.</li>
        </ul>
      </div>

      <div className="card">
        <h2>Why Farmers Need Hedging</h2>
        <div style={{ display: 'grid', gap: '15px', marginTop: '15px' }}>
          <div className="alert info">
            <strong>Price Volatility:</strong> Oilseed prices can fluctuate significantly due to weather, demand, and global markets.
          </div>
          <div className="alert info">
            <strong>Income Stability:</strong> Hedging helps lock in prices, ensuring predictable income for planning and expenses.
          </div>
          <div className="alert info">
            <strong>Risk Mitigation:</strong> Protects against adverse price movements while allowing participation in favorable trends.
          </div>
        </div>
      </div>

      <div className="card">
        <h2>How to Use This Platform</h2>
        <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li><strong>Monitor Prices:</strong> Check current prices and predictions in the Prices section</li>
          <li><strong>Set Alerts:</strong> Create price alerts to stay informed of market movements</li>
          <li><strong>Create Hedges:</strong> Use virtual trading to practice hedging strategies without real money</li>
          <li><strong>Track Performance:</strong> Monitor your positions and P&L in the Contracts section</li>
          <li><strong>Learn & Adapt:</strong> Use insights from technical indicators to improve your strategies</li>
        </ol>
      </div>

      <div className="card">
        <h2>Key Terms</h2>
        <table>
          <tbody>
            <tr>
              <td><strong>Strike Price</strong></td>
              <td>The price at which you agree to buy/sell the commodity</td>
            </tr>
            <tr>
              <td><strong>P&L (Profit & Loss)</strong></td>
              <td>The gain or loss on your position based on current vs. strike price</td>
            </tr>
            <tr>
              <td><strong>SMA (Simple Moving Average)</strong></td>
              <td>Average price over a specific period, used to identify trends</td>
            </tr>
            <tr>
              <td><strong>Volatility</strong></td>
              <td>Measure of price fluctuation; higher volatility means higher risk</td>
            </tr>
            <tr>
              <td><strong>NCDEX</strong></td>
              <td>National Commodity & Derivatives Exchange, India's commodity trading platform</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="alert success">
        <strong>💡 Pro Tip:</strong> Start small and practice with virtual contracts to understand hedging before committing real resources. 
        Always monitor market trends and adjust your strategy accordingly.
      </div>
    </div>
  )
}

export default Education
