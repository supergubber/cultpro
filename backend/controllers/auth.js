const crypto = require('crypto')
const User = require('../models/user')
const bcryptjs = require('bcryptjs')

const otpTemplate = require('../mail/templates/emailVerificationTemplate')

const {
  generateTokenAndSetCookie,
} = require('../utile/generateTokenAndSetCookie.js')
const mailSender = require('../utile/mailSender.js')

exports.signup = async (req, res) => {
  const { email, password, firstName, lastName, confirmPassword } = req.body
  try {
    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      throw new Error('All Fields are required')
    }
    if (password !== confirmPassword) {
      throw new Error('Password are not same')
    }
    const userAlreadyExists = await User.findOne({ email })
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' })
    }
    const hashedPassword = await bcryptjs.hash(password, 10)
    const hashedConfirmPassword = await bcryptjs.hash(confirmPassword, 10)
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString()
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      confirmPassword: hashedConfirmPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    })

    await user.save()

    generateTokenAndSetCookie(res, user._id)
    await mailSender(
      user.email,
      verificationToken,
      'your authentication successfully'
    )

    res.status(201).json({
      success: true,
      message: 'user created successfully',
      user: { ...user._doc, password: undefined, confirmPassword: undefined },
    })
  } catch (error) {
    console.log('signup bad request')
    console.error(error)
    res.status(400).json({ success: false, message: error.message })
  }
}
exports.verifyEmail = async (req, res) => {
  const { code } = req.body
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code',
      })
    }
    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiresAt = undefined

    await user.save()

    await mailSender(user.email, user.name, otpTemplate)
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        ...user._dov,
        password: undefined,
      },
    })
  } catch (error) {
    console.log('error in verifyEmail ', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password)

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid credentials' })
    }

    generateTokenAndSetCookie(res, user._id)

    user.lastLogin = new Date()
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: {
        ...user._doc,
        password: undefined,
        confirmPassword: undefined,
      },
    })
  } catch (error) {
    console.log('Error in login', error)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
}

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token')
    res.status(200).json({ success: true, message: 'Logged out successfully' })
  } catch (error) {}
}

exports.checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ success: true, user })
  } catch (error) {
    console.log('Error in checkAuth ', error)
    res.status(400).json({ success: false, message: error.message })
  }
}
