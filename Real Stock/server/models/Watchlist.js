import mongoose from 'mongoose'

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
})

// Create compound index for userId and symbol
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true })

export default mongoose.model('Watchlist', watchlistSchema)