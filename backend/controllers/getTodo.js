const Todo = require('../models/Todo')

exports.getTodo = async (req, res) => {
  try {
    const getAllTodo = await Todo.find({})
    res.status(200).json({
      success: true,
      data: getAllTodo,
      message: 'get all data',
    })
  } catch (error) {
    console.log('Not get all Data')
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
