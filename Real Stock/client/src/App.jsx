import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import StockDetails from './pages/StockDetails'
import Watchlist from './pages/Watchlist'
import Login from './pages/Login'
import Compare from './pages/Compare'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stock/:symbol" element={<StockDetails />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/compare" element={<Compare />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App