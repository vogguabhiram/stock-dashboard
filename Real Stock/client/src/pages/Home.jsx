import React, { useState, useEffect } from 'react'

const stocksList = ["AAPL","TSLA","MSFT","GOOGL","AMZN"]

const Home = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 20000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const res = await Promise.all(
        stocksList.map(s =>
          fetch(`http://localhost:5000/api/stocks/${s}`)
            .then(r => r.json())
            .catch(() => null)
        )
      )
      setData(res.filter(Boolean))
    } catch (e) {
      console.log(e)
    }
  }

  return (
  <div className="p-6 space-y-6">

    <h1 className="text-3xl font-bold text-center">
      Stock Dashboard 🚀
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {data.map(stock => (
        <div
          key={stock.symbol}
          className="bg-white shadow-lg rounded-xl p-5 transition-transform duration-300 hover:scale-105"
        >
          <h2 className="text-xl font-semibold">
            {stock.symbol}
          </h2>

          <p className="text-lg mt-2">
            ${stock.price?.toFixed(2)}
          </p>

          <p
            className={`mt-2 font-semibold ${
              stock.change > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {stock.change > 0 ? "+" : ""}
            {stock.change?.toFixed(2)} (
            {stock.changePercent?.toFixed(2)}%)
          </p>
        </div>
      ))}

    </div>

  </div>
)
}

export default Home