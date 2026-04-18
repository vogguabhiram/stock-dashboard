import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' })
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }
    
    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    })
    
    await user.save()
    
    // Generate token
    const token = generateToken(user._id)
    
    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Failed to register user', error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }
    
    // Find user
    const user = await User.findOne({ email: email.trim().toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    
    // Generate token
    const token = generateToken(user._id)
    
    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Failed to login', error: error.message })
  }
}

export const verifyToken = async (req, res) => {
  try {
    // Token is already verified by middleware
    res.json({
      user: req.user.toJSON(),
      message: 'Token is valid'
    })
  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({ message: 'Failed to verify token', error: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    res.json({ user: req.user.toJSON() })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Failed to get profile', error: error.message })
  }
}