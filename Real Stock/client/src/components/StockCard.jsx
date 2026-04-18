import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Plus } from 'lucide-react'

const StockCard = ({ stock, onAddToWatchlist, showAddButton = false }) => {
  const isPositive = stock.change >= 0
  const changeColor = isPositive ? 'text-success-600' : 'text-danger-600'
  const bgColor = isPositive ? 'bg-success-50 dark:bg-success-900/20' : 'bg-danger-50 dark:bg-danger-900/20'

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(price)
  }

  const formatChange = (change, changePercent) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${formatPrice(change)} (${sign}${changePercent.toFixed(2)}%)`
  }

  return (
    <div className="stock-card group">
      <div className="flex items-center justify-between mb-4">
        <Link to={`/stock/${stock.symbol}`} className="flex-1">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
              {isPositive ? (
                <TrendingUp className={`h-6 w-6 ${changeColor}`} />
              ) : (
                <TrendingDown className={`h-6 w-6 ${changeColor}`} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {stock.symbol.replace('.NS', '')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stock.companyName || 'Stock'}</p>
            </div>
          </div>
        </Link>
        
        {showAddButton && onAddToWatchlist && (
          <button
            onClick={() => onAddToWatchlist(stock)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      <Link to={`/stock/${stock.symbol}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(stock.price)}
            </span>
          </div>
          
          <div className={`text-sm font-medium ${changeColor}`}>
            {formatChange(stock.change, stock.changePercent)}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
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
      </Link>
    </div>
  )
}

export default StockCard