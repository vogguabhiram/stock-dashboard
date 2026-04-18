import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  baseURL: "https://api.voarion.in/api",
  timeout: 10000,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Stock API endpoints
export const stocksAPI = {
  getQuote: async (symbol) => {
    const response = await api.get(`/stocks/${symbol}`)
    return response.data
  },

  getHistoricalData: async (symbol, period) => {
    const response = await api.get(`/stocks/${symbol}/history?period=${period}`)
    return response.data
  },

  searchStocks: async (query) => {
    const response = await api.get(`/stocks/search?q=${query}`)
    return response.data
  }
}

// Watchlist API endpoints
export const watchlistAPI = {
  getWatchlist: async (userId) => {
    const response = await api.get(`/watchlist/${userId}`)
    return response.data
  },

  addToWatchlist: async (stockData) => {
    const response = await api.post('/watchlist', stockData)
    return response.data
  },

  removeFromWatchlist: async (symbol) => {
    const response = await api.delete(`/watchlist/${symbol}`)
    return response.data
  }
}

// Authentication API endpoints
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  register: async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password })
    return response.data
  },

  verifyToken: async () => {
    const response = await api.get('/auth/verify')
    return response.data
  }
}