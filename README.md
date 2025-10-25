# 🌾 Oilseed Hedging Platform

A digital platform for virtual hedging and risk management designed for oilseed farmers in India. This MVP provides price forecasting, virtual futures trading, market alerts, and educational resources to help farmers manage price volatility.

## 📋 Problem Statement

**ID:** 25274  
**Organization:** Ministry of Agriculture & Farmers Welfare (MoA&FW)

Oilseed farmers in India face acute price volatility without adequate hedging tools. This platform addresses that gap by providing accessible risk management tools including:

- 📊 AI-driven price predictions
- 💹 Virtual futures trading simulation
- 🔔 Real-time price alerts
- 📚 Financial literacy education
- 📈 Market trend analysis

## 🚀 Features

### Core Features
- **Price Forecasting**: AI-based predictions using time-series analysis (SMA, EMA, trend analysis)
- **Virtual Trading**: Simulate futures contracts (long/short positions) without real money risk
- **Contract Management**: Track active and closed positions with P&L calculations
- **Price Alerts**: Set threshold-based notifications for market movements
- **Market Dashboard**: Real-time price data for major oilseeds (Soybean, Mustard, Groundnut, Sunflower)
- **Educational Module**: Learn hedging concepts and risk management strategies

### Technical Features
- RESTful API with Express.js
- SQLite database for lightweight deployment
- React frontend with responsive design
- Real-time price charts using Recharts
- Secure user authentication with bcrypt

## 🏗️ Architecture

```
oilseed-hedging-platform/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic (prediction algorithms)
│   │   └── server.js    # Main server file
│   └── data/            # SQLite database
│
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   └── App.jsx      # Main app component
│   └── index.html       # Entry HTML
│
└── README.md
```

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- SQLite3 (database)
- bcryptjs (password hashing)
- JWT (authentication tokens)

**Frontend:**
- React 18
- Vite (build tool)
- React Router (navigation)
- Recharts (data visualization)
- Axios (HTTP client)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or navigate to the project:**
```bash
cd ~/oilseed-hedging-platform
```

2. **Install backend dependencies:**
```bash
cd backend
npm install
```

3. **Initialize the database:**
```bash
npm run init-db
```

4. **Seed the database with sample data:**
```bash
node src/config/seedData.js
```

5. **Install frontend dependencies:**
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

Or for development with auto-reload:
```bash
npm run dev
```

### Start Frontend Application
```bash
cd frontend
npm run dev
# Application runs on http://localhost:3000
```

### Access the Application
Open your browser and navigate to: `http://localhost:3000`

**Demo Credentials:**
- Email: `demo@farmer.com`
- Password: `demo123`

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### User APIs
- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `GET /users/:userId` - Get user profile

#### Price APIs
- `GET /prices/crops` - Get all crops
- `GET /prices/current` - Get current prices for all crops
- `GET /prices/history/:cropId` - Get price history
- `GET /prices/predict/:cropId?days=7` - Get price predictions
- `GET /prices/volatility/:cropId` - Calculate volatility

#### Contract APIs
- `GET /contracts/user/:userId` - Get user's contracts
- `POST /contracts` - Create new contract
- `PUT /contracts/:contractId/close` - Close a contract
- `GET /contracts/stats/:userId` - Get contract statistics

#### Alert APIs
- `GET /alerts/user/:userId` - Get user's alerts
- `POST /alerts` - Create new alert
- `PUT /alerts/:alertId/toggle` - Toggle alert status
- `DELETE /alerts/:alertId` - Delete alert
- `GET /alerts/check` - Check triggered alerts

## 📊 Database Schema

### Tables
- **users**: User accounts with authentication
- **crops**: Oilseed crop information
- **price_history**: Historical price data
- **contracts**: Hedging contracts (long/short positions)
- **transactions**: Transaction history
- **alerts**: Price alert configurations

## 🎓 How to Use

1. **Login**: Use demo credentials or register a new account
2. **Dashboard**: View market overview and your portfolio statistics
3. **Prices**: Analyze price trends and AI predictions
4. **Trading**: Create virtual hedge contracts (long/short)
5. **Contracts**: Monitor and close your active positions
6. **Alerts**: Set price notifications for market movements
7. **Education**: Learn about hedging and risk management

## 🧮 Price Prediction Algorithm

The platform uses a multi-factor prediction model:
- **Simple Moving Average (SMA)**: 7-day and 14-day averages
- **Exponential Moving Average (EMA)**: Weighted recent prices
- **Linear Regression**: Trend analysis
- **Weighted Forecast**: Combines multiple indicators with confidence scoring

Confidence decreases for longer-term predictions to reflect uncertainty.

## 🔐 Security Features

- Password hashing with bcrypt (10 rounds)
- SQL injection prevention via parameterized queries
- CORS enabled for secure cross-origin requests
- Input validation on all forms

## 🌱 Sample Data

The seed script populates:
- 4 major oilseed crops (Soybean, Mustard, Groundnut, Sunflower)
- 60 days of realistic price history with volatility
- Demo user account for testing

## 📈 Future Enhancements

- Blockchain integration for contract transparency
- Mobile application (React Native)
- Integration with actual NCDEX data feeds
- SMS/Email notifications for alerts
- Multi-language support (Hindi, regional languages)
- FPO (Farmer Producer Organization) management features
- Advanced ML models (LSTM, ARIMA) for predictions
- Social features for farmer communities

## 🤝 Contributing

This is an MVP for the SIH 2025 problem statement. Contributions and suggestions are welcome!

## 📄 License

MIT License - Feel free to use and modify for educational and agricultural purposes.

## 👥 Credits

Developed for Smart India Hackathon 2025  
Problem Statement ID: 25274  
Ministry of Agriculture & Farmers Welfare

---

**Note**: This is a virtual trading platform for educational and simulation purposes. Always consult with agricultural and financial experts before making real hedging decisions.
