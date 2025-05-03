const mongoose = require('mongoose')
const Todo = require('../models/Todo')

exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params

    const response = await Todo.findById(id)

    res.status(200).json({
      success: true,
      message: 'this data is get',
      data: response,
    })
  } catch (error) {
    console.log('get by id not found')
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'this data is error',
    })
  }
}
