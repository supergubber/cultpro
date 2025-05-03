const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
  try {
    const response = await mongoose.connect(process.env.MONGO_URI)
    console.log(`✅ MongoDB Connected: ${response.connection.host}`)
    console.log('📦 Database started successfully')
  } catch (error) {
    console.error(`❌ Error DB: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
