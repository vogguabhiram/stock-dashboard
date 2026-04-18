import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, TrendingUp, TrendingDown, Eye } from 'lucide-react'
import { watchlistAPI, stocksAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const Watchlist = () => {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchWatchlist()
    }
  }, [user])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      const watchlistData = await watchlistAPI.getWatchlist(user.id)
      
      // Fetch current prices for watchlist items
      const stockPromises = watchlistData.map(async (item) => {
        try {
          const stockData = await stocksAPI.getQuote(item.symbol)
          return { ...item, ...stockData }
        } catch (error) {
          console.error(`Error fetching data for ${item.symbol}:`, error)
          return { ...item, price: 0, change: 0, changePercent: 0 }
        }
      })
      
      const watchlistWithPrices = await Promise.all(stockPromises)
      setWatchlist(watchlistWithPrices)
    } catch (error) {
      console.error('Error fetching watchlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWatchlist = async (symbol) => {
    try {
      await watchlistAPI.removeFromWatchlist(symbol)
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol))
    } catch (error) {
      console.error('Error removing from watchlist:', error)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Please login to view your watchlist
        </h2>
        <Link to="/login" className="btn-primary">
          Login
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          My Watchlist
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your favorite stocks in real-time
        </p>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Your watchlist is empty
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding stocks to track their performance
          </p>
          <Link to="/" className="btn-primary">
            Explore Stocks
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {/* Watchlist Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-primary-100 dark:bg-primary-900/20 rounded-full p-3">
                  <Eye className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Stocks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{watchlist.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-success-100 dark:bg-success-900/20 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gainers</p>
                  <p className="text-2xl font-bold text-success-600">
                    {watchlist.filter(stock => stock.changePercent > 0).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-danger-100 dark:bg-danger-900/20 rounded-full p-3">
                  <TrendingDown className="h-6 w-6 text-danger-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Losers</p>
                  <p className="text-2xl font-bold text-danger-600">
                    {watchlist.filter(stock => stock.changePercent < 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Watchlist Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Watchlist Stocks
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      % Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {watchlist.map((stock) => {
                    const isPositive = stock.changePercent >= 0
                    const changeColor = isPositive ? 'text-success-600' : 'text-danger-600'
                    const bgColor = isPositive ? 'bg-success-50 dark:bg-success-900/20' : 'bg-danger-50 dark:bg-danger-900/20'
                    
                    return (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
                              {isPositive ? (
                                <TrendingUp className={`h-4 w-4 ${changeColor}`} />
                              ) : (
                                <TrendingDown className={`h-4 w-4 ${changeColor}`} />
                              )}
                            </div>
                            <div>
                              <Link 
                                to={`/stock/${stock.symbol}`}
                                className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                              >
                                {stock.symbol.replace('.NS', '')}
                              </Link>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {stock.companyName}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {formatPrice(stock.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${changeColor}`}>
                            {isPositive ? '+' : ''}{formatPrice(stock.change)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${changeColor}`}>
                            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/stock/${stock.symbol}`}
                              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => removeFromWatchlist(stock.symbol)}
                              className="text-danger-600 hover:text-danger-700 dark:text-danger-400 dark:hover:text-danger-300 p-1 rounded-full hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Watchlist