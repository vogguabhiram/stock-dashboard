import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.userId)
      if (user) {
        req.user = user
      }
    }
    
    next()
  } catch (error) {
    // Continue without auth if token is invalid
    next()
  }
}