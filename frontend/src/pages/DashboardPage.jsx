import React, { useEffect, useState } from 'react'
import { CiLogout } from 'react-icons/ci'
import Avatar from '@mui/material/Avatar'
import { useAuthStore } from '../store/authStore'
import { Grid } from '@mui/material'

const DashboardPage = () => {
  const {
    user,
    logout,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    todos,
  } = useAuthStore()

  const [dataValue, setDataValue] = useState({ title: '', description: '' })
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchTodos()
      } catch (err) {
        console.error('Failed to fetch todos:', err)
      }
    }
    fetchData()
  }, [fetchTodos])

  const handleChange = (e) => {
    const { name, value } = e.target
    setDataValue((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = (todo) => {
    setDataValue({ title: todo.title, description: todo.description })
    setEditMode(true)
    setEditId(todo._id)
  }

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id)
      await fetchTodos()
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editMode) {
        await updateTodo(editId, dataValue)
      } else {
        await createTodo(dataValue.title, dataValue.description)
      }
      setDataValue({ title: '', description: '' })
      setEditMode(false)
      setEditId(null)
      await fetchTodos()
    } catch (err) {
      console.error('Submit error:', err)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }
  return (
    <div className='max-w-screen min-h-screen mx-auto bg-gray-100'>
      <div className='w-11/12 min-h-screen bg-gray-100 mx-auto relative'>
        <div className='sticky bg-white w-full top-0 left-0 p-4 h-fit overflow-hidden shadow-lg shadow-gray-400'>
          <div className='flex flex-row items-end justify-between flex-wrap'>
            <form
              className='flex flex-row gap-6 items-center flex-wrap'
              onSubmit={handleSubmit}
            >
              <div className='flex flex-col gap-2 w-fit'>
                {/* <label htmlFor='title' className='font-bold text-xl'>
                  Title<sup>*</sup>
                </label> */}
                <input
                  type='text'
                  id='title'
                  name='title'
                  placeholder='Title'
                  className='border border-gray-500 px-3 py-2 rounded-sm'
                  value={dataValue.title}
                  onChange={handleChange}
                />
              </div>
              <div className='flex flex-col gap-2 w-fit'>
                {/* <label htmlFor='description' className='font-bold text-xl'>
                  Description<sup>*</sup>
                </label> */}
                <input
                  type='text'
                  id='description'
                  name='description'
                  placeholder='Description'
                  value={dataValue.description}
                  className='border border-gray-500 px-3 py-2 rounded-sm'
                  onChange={handleChange}
                />
              </div>
              <div className=''>
                <button className='px-3 py-2 font-bold text-white rounded-lg shadow-lg bg-blue-500 cursor-pointer hover:scale-95'>
                  Submit
                </button>
              </div>
            </form>
            <div className='flex flex-row items-center justify-evenly gap-8 flex-wrap'>
              <p className='text-lg font-semibold'>{user.firstName} Khan</p>
              <Avatar
                alt='Remy Sharp'
                src='https://mui.com/static/images/avatar/3.jpg'
                className='shadow-lg shadow-amber-100'
              />
              <CiLogout
                className='cursor-pointer text-3xl'
                title='logout'
                onClick={handleLogout}
              />
            </div>
          </div>
        </div>
        <div className='mt-10 px-4'>
          <Grid container spacing={3}>
            {todos?.map((item) => (
              <Grid
                size={{ xs: 12, sm: 6, md: 3 }}
                md={3}
                lg={4}
                key={item._id}
                sx={{ background: 'white', borderRadius: 1 }}
                className={`shadow-lg`}
              >
                <div className='p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow h-full'>
                  <h2 className='text-lg font-semibold text-gray-800'>
                    {item.title}
                  </h2>
                  <p className='text-gray-600 mt-1'>{item.description}</p>
                  <div className='mt-3 flex space-x-2'>
                    <button
                      className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600'
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
