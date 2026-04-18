import express from 'express'
import { getStockQuote, getHistoricalData, searchStocks } from '../controllers/stockController.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// Search stocks
router.get('/search', optionalAuth, searchStocks)

// Get stock quote
router.get('/:symbol', optionalAuth, getStockQuote)

// Get historical data
router.get('/:symbol/history', optionalAuth, getHistoricalData)

export default router