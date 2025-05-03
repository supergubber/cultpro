const express = require('express')
const connectDB = require('./config/db')
require('dotenv').config()
const authRouter = require('./routes/authRoute')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const _dirname = path.resolve()
const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)

app.use(express.static(path.join(_dirname, '/frontend/dist')))
app.get('*', (_, res) => {
  res.sendFile(path.resolve(_dirname, 'frontend', 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
  connectDB()
})
