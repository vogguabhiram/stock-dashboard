import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Moon, Sun, Menu, X, TrendingUp, User } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const symbol = searchQuery.toUpperCase() + (searchQuery.includes('.NS') ? '' : '.NS')
      navigate(`/stock/${symbol}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
            <TrendingUp className="h-8 w-8" />
            <span className="text-xl font-bold">StockDash</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/watchlist" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Watchlist
            </Link>
            <Link to="/compare" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
              Compare
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks (e.g., RELIANCE, TCS)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary pl-10 pr-4"
              />
            </div>
          </form>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search stocks"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-primary pl-10 pr-4"
                  />
                </div>
              </form>
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/watchlist"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Watchlist
              </Link>
              <Link
                to="/compare"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar