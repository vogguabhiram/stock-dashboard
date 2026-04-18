import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const StockChart = ({ data, timeframe, symbol }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000)
    
    switch (timeframe) {
      case '1D':
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      case '1W':
      case '1M':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      case '6M':
      case '1Y':
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          year: '2-digit' 
        })
      default:
        return date.toLocaleDateString('en-US')
    }
  }

  const chartData = {
    labels: data.map(item => formatTime(item.t)),
    datasets: [
      {
        label: symbol,
        data: data.map(item => item.c),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#3b82f6',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            return `${symbol} - ${context[0].label}`
          },
          label: function(context) {
            return `Price: ₹${context.parsed.y.toFixed(2)}`
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.2)',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return '₹' + value.toFixed(0)
          }
        },
      },
    },
  }

  return (
    <div className="h-96">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default StockChart