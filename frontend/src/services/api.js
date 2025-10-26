import axios from 'axios'

const API_BASE = '/api'

const api = {
  // User APIs
  login: (credentials) => axios.post(`${API_BASE}/users/login`, credentials),
  register: (userData) => axios.post(`${API_BASE}/users/register`, userData),
  
  // Price APIs
  getCrops: () => axios.get(`${API_BASE}/prices/crops`),
  getCurrentPrices: () => axios.get(`${API_BASE}/prices/current`),
  getPriceHistory: (cropId, limit = 30) => axios.get(`${API_BASE}/prices/history/${cropId}?limit=${limit}`),
  getPrediction: (cropId, days = 7) => axios.get(`${API_BASE}/prices/predict/${cropId}?days=${days}`),
  getVolatility: (cropId) => axios.get(`${API_BASE}/prices/volatility/${cropId}`),
  
  // Contract APIs
  getUserContracts: (userId, status = '') => {
    const url = status ? `${API_BASE}/contracts/user/${userId}?status=${status}` : `${API_BASE}/contracts/user/${userId}`
    return axios.get(url)
  },
  createContract: (contractData) => axios.post(`${API_BASE}/contracts`, contractData),
  closeContract: (contractId, currentPrice) => axios.put(`${API_BASE}/contracts/${contractId}/close`, { currentPrice }),
  getContractStats: (userId) => axios.get(`${API_BASE}/contracts/stats/${userId}`),
  
  // Alert APIs
  getUserAlerts: (userId) => axios.get(`${API_BASE}/alerts/user/${userId}`),
  createAlert: (alertData) => axios.post(`${API_BASE}/alerts`, alertData),
  toggleAlert: (alertId) => axios.put(`${API_BASE}/alerts/${alertId}/toggle`),
  deleteAlert: (alertId) => axios.delete(`${API_BASE}/alerts/${alertId}`),
  checkAlerts: () => axios.get(`${API_BASE}/alerts/check`),

  // Chatbot APIs
  sendChatMessage: (data) => axios.post(`${API_BASE}/chatbot/chat`, data),
  getChatbotLanguages: () => axios.get(`${API_BASE}/chatbot/languages`),
}

export default api
