import Watchlist from '../models/Watchlist.js'

export const getWatchlist = async (req, res) => {
  try {
    const { userId } = req.params
    
    const watchlist = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean()
    
    res.json(watchlist)
  } catch (error) {
    console.error('Error fetching watchlist:', error)
    res.status(500).json({ message: 'Failed to fetch watchlist', error: error.message })
  }
}

export const addToWatchlist = async (req, res) => {
  try {
    const { symbol, companyName } = req.body
    const userId = req.user._id
    
    // Check if already exists
    const existingItem = await Watchlist.findOne({ userId, symbol })
    if (existingItem) {
      return res.status(400).json({ message: 'Stock already in watchlist' })
    }
    
    const watchlistItem = new Watchlist({
      userId,
      symbol,
      companyName: companyName || symbol.replace('.NS', '')
    })
    
    await watchlistItem.save()
    
    res.status(201).json(watchlistItem)
  } catch (error) {
    console.error('Error adding to watchlist:', error)
    res.status(500).json({ message: 'Failed to add to watchlist', error: error.message })
  }
}

export const removeFromWatchlist = async (req, res) => {
  try {
    const { symbol } = req.params
    const userId = req.user._id
    
    const result = await Watchlist.findOneAndDelete({ userId, symbol })
    
    if (!result) {
      return res.status(404).json({ message: 'Item not found in watchlist' })
    }
    
    res.json({ message: 'Removed from watchlist successfully' })
  } catch (error) {
    console.error('Error removing from watchlist:', error)
    res.status(500).json({ message: 'Failed to remove from watchlist', error: error.message })
  }
}

export const getUserWatchlist = async (req, res) => {
  try {
    const userId = req.user._id
    
    const watchlist = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean()
    
    res.json(watchlist)
  } catch (error) {
    console.error('Error fetching user watchlist:', error)
    res.status(500).json({ message: 'Failed to fetch watchlist', error: error.message })
  }
}