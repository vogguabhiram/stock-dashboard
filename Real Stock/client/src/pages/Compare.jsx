import React, { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown } from 'lucide-react'
import StockChart from '../components/StockChart'
import { stocksAPI } from '../services/api'

const Compare = () => {
  const [stock1, setStock1] = useState(null)
  const [stock2, setStock2] = useState(null)
  const [stock1Symbol, setStock1Symbol] = useState('')
  const [stock2Symbol, setStock2Symbol] = useState('')
  const [chartData1, setChartData1] = useState([])
  const [chartData2, setChartData2] = useState([])
  const [timeframe, setTimeframe] = useState('1M')
  const [loading, setLoading] = useState(false)

  const timeframes = [
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' }
  ]

  const handleCompare = async () => {
    if (!stock1Symbol || !stock2Symbol) return
    
    setLoading(true)
    try {
      // Add .NS suffix if not present
      const symbol1 = stock1Symbol.includes('.NS') ? stock1Symbol : stock1Symbol + '.NS'
      const symbol2 = stock2Symbol.includes('.NS') ? stock2Symbol : stock2Symbol + '.NS'
      
      // Fetch stock data
      const [stockData1, stockData2] = await Promise.all([
        stocksAPI.getQuote(symbol1),
        stocksAPI.getQuote(symbol2)
      ])
      
      setStock1(stockData1)
      setStock2(stockData2)
      
      // Fetch chart data
      const [chartData1, chartData2] = await Promise.all([
        stocksAPI.getHistoricalData(symbol1, timeframe),
        stocksAPI.getHistoricalData(symbol2, timeframe)
      ])
      
      setChartData1(chartData1)
      setChartData2(chartData2)
    } catch (error) {
      console.error('Error comparing stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTimeframeChange = async (newTimeframe) => {
    setTimeframe(newTimeframe)
    
    if (stock1 && stock2) {
      try {
        const [chartData1, chartData2] = await Promise.all([
          stocksAPI.getHistoricalData(stock1.symbol, newTimeframe),
          stocksAPI.getHistoricalData(stock2.symbol, newTimeframe)
        ])
        
        setChartData1(chartData1)
        setChartData2(chartData2)
      } catch (error) {
        console.error('Error fetching chart data:', error)
      }
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const StockComparisonCard = ({ stock, title }) => {
    if (!stock) return null
    
    const isPositive = stock.changePercent >= 0
    const changeColor = isPositive ? 'text-success-600' : 'text-danger-600'
    const bgColor = isPositive ? 'bg-success-50 dark:bg-success-900/20' : 'bg-danger-50 dark:bg-danger-900/20'
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
            {isPositive ? (
              <TrendingUp className={`h-6 w-6 ${changeColor}`} />
            ) : (
              <TrendingDown className={`h-6 w-6 ${changeColor}`} />
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {stock.companyName || stock.symbol.replace('.NS', '')}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stock.symbol}</p>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(stock.price)}
            </p>
            <p className={`text-sm font-medium ${changeColor}`}>
              {isPositive ? '+' : ''}{formatPrice(stock.change)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">High</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(stock.high)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Low</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{formatPrice(stock.low)}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Compare Stocks
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Compare two stocks side by side
        </p>
      </div>

      {/* Search Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="First stock (e.g., RELIANCE)"
              value={stock1Symbol}
              onChange={(e) => setStock1Symbol(e.target.value.toUpperCase())}
              className="input-primary pl-10"
            />
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Second stock (e.g., TCS)"
              value={stock2Symbol}
              onChange={(e) => setStock2Symbol(e.target.value.toUpperCase())}
              className="input-primary pl-10"
            />
          </div>
          
          <button
            onClick={handleCompare}
            disabled={loading || !stock1Symbol || !stock2Symbol}
            className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Comparing...
              </div>
            ) : (
              'Compare'
            )}
          </button>
        </div>
      </div>

      {stock1 && stock2 && (
        <>
          {/* Stock Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StockComparisonCard stock={stock1} title="Stock 1" />
            <StockComparisonCard stock={stock2} title="Stock 2" />
          </div>

          {/* Performance Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Performance Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price Difference</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(Math.abs(stock1.price - stock2.price))}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stock1.price > stock2.price ? `${stock1.symbol} higher` : `${stock2.symbol} higher`}
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Better Performer</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {stock1.changePercent > stock2.changePercent ? 
                    stock1.symbol.replace('.NS', '') : 
                    stock2.symbol.replace('.NS', '')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.abs(stock1.changePercent - stock2.changePercent).toFixed(2)}% difference
                </p>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume Leader</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {(stock1.volume || 0) > (stock2.volume || 0) ? 
                    stock1.symbol.replace('.NS', '') : 
                    stock2.symbol.replace('.NS', '')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Higher trading volume</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Price Charts</h3>
              <div className="flex space-x-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => handleTimeframeChange(tf.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeframe === tf.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {stock1.symbol.replace('.NS', '')}
                </h4>
                {chartData1.length > 0 && (
                  <StockChart data={chartData1} timeframe={timeframe} symbol={stock1.symbol} />
                )}
              </div>
              
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {stock2.symbol.replace('.NS', '')}
                </h4>
                {chartData2.length > 0 && (
                  <StockChart data={chartData2} timeframe={timeframe} symbol={stock2.symbol} />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Suggested Comparisons */}
      {!stock1 && !stock2 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            Popular Comparisons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => {
                setStock1Symbol('RELIANCE')
                setStock2Symbol('TCS')
              }}
              className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">RELIANCE vs TCS</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Oil & Gas vs IT Services</p>
            </button>
            
            <button
              onClick={() => {
                setStock1Symbol('HDFCBANK')
                setStock2Symbol('ICICIBANK')
              }}
              className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">HDFC vs ICICI</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Banking Sector</p>
            </button>
            
            <button
              onClick={() => {
                setStock1Symbol('INFY')
                setStock2Symbol('WIPRO')
              }}
              className="p-4 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">INFY vs WIPRO</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">IT Services</p>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Compare