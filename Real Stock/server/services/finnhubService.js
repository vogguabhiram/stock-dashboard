import axios from 'axios'

class FinnhubService {
  constructor() {
    this.baseURL = 'https://finnhub.io/api/v1'
  }

  async getQuote(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/quote`, {
        params: {
          symbol: symbol,
          token: process.env.FINNHUB_API_KEY   // ✅ FIXED
        }
      })

      const data = response.data
      
      const change = data.c - data.pc
      const changePercent = (change / data.pc) * 100

      return {
        symbol: symbol,
        price: data.c,
        change: change,
        changePercent: changePercent,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        timestamp: data.t
      }
    } catch (error) {
      console.error('Error fetching quote from Finnhub:', error.response?.data || error.message)
      throw new Error('Failed to fetch stock quote')
    }
  }

  async getCandles(symbol, resolution, from, to) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/candle`, {
        params: {
          symbol: symbol,
          resolution: resolution,
          from: from,
          to: to,
          token: process.env.FINNHUB_API_KEY   // ✅ FIXED
        }
      })

      const data = response.data
      
      if (data.s === 'no_data') {
        return []
      }

      const candles = []
      for (let i = 0; i < data.t.length; i++) {
        candles.push({
          t: data.t[i],
          o: data.o[i],
          h: data.h[i],
          l: data.l[i],
          c: data.c[i],
          v: data.v[i]
        })
      }

      return candles
    } catch (error) {
      console.error('Error fetching candles from Finnhub:', error.response?.data || error.message)
      throw new Error('Failed to fetch historical data')
    }
  }

  async searchSymbols(query) {
    try {
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          q: query,
          token: process.env.FINNHUB_API_KEY   // ✅ FIXED
        }
      })

      return response.data.result || []
    } catch (error) {
      console.error('Error searching symbols:', error.response?.data || error.message)
      return []
    }
  }

  getTimeRange(period) {
    const now = Math.floor(Date.now() / 1000)
    let from, resolution
    
    switch (period) {
      case '1D':
        from = now - (24 * 60 * 60)
        resolution = '5'
        break
      case '1W':
        from = now - (7 * 24 * 60 * 60)
        resolution = '30'
        break
      case '1M':
        from = now - (30 * 24 * 60 * 60)
        resolution = 'D'
        break
      case '6M':
        from = now - (6 * 30 * 24 * 60 * 60)
        resolution = 'D'
        break
      case '1Y':
        from = now - (365 * 24 * 60 * 60)
        resolution = 'D'
        break
      default:
        from = now - (30 * 24 * 60 * 60)
        resolution = 'D'
    }
    
    return { from, to: now, resolution }
  }
}

export default new FinnhubService()