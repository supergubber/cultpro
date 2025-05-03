const Todo = require('../models/Todo')

exports.updatedTodo = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description } = req.body

    const response = await Todo.findByIdAndUpdate(
      { _id: id },
      { title, description }
    )

    res.status(200).json({
      success: true,
      message: 'the data is updated successfully',
      data: response,
    })
  } catch (error) {
    console.log('updated is error')
    console.error('error', error)
    res.status(500).json({
      success: false,
      message: 'data is error',
    })
  }
}
