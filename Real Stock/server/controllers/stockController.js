import finnhubService from '../services/finnhubService.js'

// Sample data for when API is not available
const sampleStockData = {
  'AAPL': { symbol: 'AAPL', price: 180, change: 2.5, changePercent: 1.4 },
  'TSLA': { symbol: 'TSLA', price: 250, change: -3.2, changePercent: -1.2 },
  'MSFT': { symbol: 'MSFT', price: 320, change: 1.8, changePercent: 0.6 },
  'GOOGL': { symbol: 'GOOGL', price: 140, change: 0.9, changePercent: 0.7 },
  'AMZN': { symbol: 'AMZN', price: 135, change: -1.1, changePercent: -0.8 }
}

export const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params
    let updatedSymbol = symbol

// Convert Indian symbols → US
if (symbol.includes('.NS')) {
  updatedSymbol = 'AAPL'
}
    
    // Try to get data from Finnhub API first
    try {
      const stockData = await finnhubService.getQuote(updatedSymbol)
      
      // Add company name if available
      if (sampleStockData[symbol]) {
        stockData.companyName = sampleStockData[symbol].companyName
      }
      
      res.json(stockData)
    } catch (apiError) {
      // Fallback to sample data if API fails
      console.warn('Finnhub API failed, using sample data:', apiError.message)
      
      if (sampleStockData[symbol]) {
        res.json(sampleStockData[symbol])
      } else {
        // Generate random data for unknown symbols
        const basePrice = 1000 + Math.random() * 2000
        const change = (Math.random() - 0.5) * 100
        const changePercent = (change / basePrice) * 100
        
        const mockData = {
          symbol,
          price: basePrice,
          change,
          changePercent,
          high: basePrice + Math.abs(change) + Math.random() * 50,
          low: basePrice - Math.abs(change) - Math.random() * 50,
          open: basePrice + (Math.random() - 0.5) * 20,
          previousClose: basePrice - change
        }
        
        res.json(mockData)
      }
    }
  } catch (error) {
    console.error('Error in getStockQuote:', error)
    res.status(500).json({ message: 'Failed to fetch stock quote', error: error.message })
  }
}

export const getHistoricalData = async (req, res) => {
  try {
    const { symbol } = req.params
    const { period = '1M' } = req.query
    
    try {
      const { from, to, resolution } = finnhubService.getTimeRange(period)
      const historicalData = await finnhubService.getCandles(symbol, resolution, from, to)
      
      res.json(historicalData)
    } catch (apiError) {
      console.warn('Finnhub API failed for historical data, generating mock data:', apiError.message)
      
      // Generate mock historical data
      const mockData = generateMockHistoricalData(period)
      res.json(mockData)
    }
  } catch (error) {
    console.error('Error in getHistoricalData:', error)
    res.status(500).json({ message: 'Failed to fetch historical data', error: error.message })
  }
}

export const searchStocks = async (req, res) => {
  try {
    const { q: query } = req.query
    
    if (!query) {
      return res.json([])
    }
    
    try {
      const results = await finnhubService.searchSymbols(query)
      
      // Filter for NSE stocks and add .NS suffix
      const nseResults = results
        .filter(stock => stock.symbol.includes('.NS') || stock.displaySymbol.includes('.NS'))
        .slice(0, 10)
        .map(stock => ({
          symbol: stock.symbol,
          description: stock.description,
          displaySymbol: stock.displaySymbol,
          type: stock.type
        }))
      
      res.json(nseResults)
    } catch (apiError) {
      console.warn('Finnhub search API failed, using local search:', apiError.message)
      
      // Fallback to local search in sample data
      const localResults = Object.keys(sampleStockData)
        .filter(symbol => 
          symbol.toLowerCase().includes(query.toLowerCase()) ||
          symbol.replace('.NS', '').toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(symbol => {
          const data = sampleStockData[symbol]
          return {
            symbol,
            ...data,
            companyName: symbol.replace('.NS', '')
          }
        })
      
      res.json(localResults)
    }
  } catch (error) {
    console.error('Error in searchStocks:', error)
    res.status(500).json({ message: 'Failed to search stocks', error: error.message })
  }
}

// Helper function to generate mock historical data
function generateMockHistoricalData(period) {
  const now = Date.now()
  const data = []
  let intervals, stepSize
  
  switch (period) {
    case '1D':
      intervals = 24 * 12 // 5-minute intervals for 24 hours
      stepSize = 5 * 60 * 1000 // 5 minutes
      break
    case '1W':
      intervals = 7 * 48 // 30-minute intervals for 7 days
      stepSize = 30 * 60 * 1000 // 30 minutes
      break
    case '1M':
      intervals = 30
      stepSize = 24 * 60 * 60 * 1000 // 1 day
      break
    case '6M':
      intervals = 180
      stepSize = 24 * 60 * 60 * 1000 // 1 day
      break
    case '1Y':
      intervals = 365
      stepSize = 24 * 60 * 60 * 1000 // 1 day
      break
    default:
      intervals = 30
      stepSize = 24 * 60 * 60 * 1000
  }
  
  let currentPrice = 1000 + Math.random() * 2000
  
  for (let i = intervals; i >= 0; i--) {
    const timestamp = Math.floor((now - (i * stepSize)) / 1000)
    const volatility = 0.02
    const change = (Math.random() - 0.5) * volatility * currentPrice
    
    currentPrice = Math.max(currentPrice + change, 100) // Minimum price of 100
    
    data.push({
      t: timestamp,
      o: currentPrice,
      h: currentPrice * (1 + Math.random() * 0.01),
      l: currentPrice * (1 - Math.random() * 0.01),
      c: currentPrice,
      v: Math.floor(Math.random() * 1000000)
    })
  }
  
  return data
}