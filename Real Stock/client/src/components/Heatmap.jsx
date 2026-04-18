import React from 'react'
import { Link } from 'react-router-dom'

const Heatmap = ({ stocks }) => {
  const getHeatmapColor = (changePercent) => {
    if (changePercent > 3) return 'bg-success-600 text-white'
    if (changePercent > 1) return 'bg-success-400 text-white'
    if (changePercent > 0) return 'bg-success-200 text-success-800'
    if (changePercent > -1) return 'bg-danger-200 text-danger-800'
    if (changePercent > -3) return 'bg-danger-400 text-white'
    return 'bg-danger-600 text-white'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Nifty50 Heatmap
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {stocks.map((stock) => (
          <Link
            key={stock.symbol}
            to={`/stock/${stock.symbol}`}
            className={`
              ${getHeatmapColor(stock.changePercent)}
              rounded-lg p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg
              flex flex-col justify-between h-24
            `}
          >
            <div className="font-semibold text-sm truncate">
              {stock.symbol.replace('.NS', '')}
            </div>
            <div className="space-y-1">
              <div className="text-xs font-medium">
                {formatPrice(stock.price)}
              </div>
              <div className="text-xs">
                {stock.changePercent > 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-4 h-4 bg-danger-600 rounded"></div>
          <span>High Loss</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <span>Neutral</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="w-4 h-4 bg-success-600 rounded"></div>
          <span>High Gain</span>
        </div>
      </div>
    </div>
  )
}

export default Heatmap