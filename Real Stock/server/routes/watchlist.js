import express from 'express'
import { getWatchlist, addToWatchlist, removeFromWatchlist, getUserWatchlist } from '../controllers/watchlistController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// All watchlist routes require authentication
router.use(authenticateToken)

// Get user's watchlist
router.get('/me', getUserWatchlist)

// Get watchlist by user ID
router.get('/:userId', getWatchlist)

// Add to watchlist
router.post('/', addToWatchlist)

// Remove from watchlist
router.delete('/:symbol', removeFromWatchlist)

export default router