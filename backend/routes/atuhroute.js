const express = require('express')
const {
  signup,
  login,
  logout,
  checkAuth,
  verifyEmail,
} = require('../controllers/auth')
const { verifyToken } = require('../middleware/verifyToken')
const { createTodo } = require('../controllers/createdTodo')
const { getTodo } = require('../controllers/getTodo')
const { getTodoById } = require('../controllers/getTodoById')
const { updatedTodo } = require('../controllers/updatedTodo')
const { deleteTodo } = require('../controllers/deleteTodo')
const router = express.Router()

router.get('/check-auth', verifyToken, checkAuth)

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)

router.post('/createTodo', createTodo)
router.get('/getTodo', getTodo)
router.get('/getTodo/:id', getTodoById)
router.put('/updatedTodo/:id', updatedTodo)
router.delete('/deleteTodo/:id', deleteTodo)

module.exports = router
