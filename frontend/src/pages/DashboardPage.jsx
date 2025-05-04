import React, { useEffect, useState } from 'react'
import { CiLogout } from 'react-icons/ci'
import Avatar from '@mui/material/Avatar'
import { useAuthStore } from '../store/authStore'
import { Grid } from '@mui/material'
import { IoMdClose } from 'react-icons/io'
import { FaRegPlusSquare } from 'react-icons/fa'
import 'animate.css'

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
  const [popup, setPopup] = useState(false)
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
    setPopup(!popup)
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
        setPopup(!popup)
      } else {
        await createTodo(dataValue.title, dataValue.description)
        setPopup(!popup)
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
  const modalClose = () => {
    setPopup(!popup)
    setDataValue({ title: '', description: '' })
    setEditMode(false)
  }
  return (
    <div className='max-w-screen min-h-screen mx-auto bg-gray-100'>
      <div className='w-11/12 min-h-screen bg-gray-100 mx-auto relative'>
        <div className='sticky bg-white w-full top-0 left-0 p-4 h-fit overflow-hidden shadow-lg shadow-gray-400'>
          <div className='flex flex-row items-center justify-between flex-wrap'>
            <div className='flex flex-row items-center justify-evenly gap-8 flex-wrap text-2xl'>
              {`${user.firstName.charAt(0).toUpperCase()}${user.firstName.slice(
                1
              )} ${user.lastName.charAt(0).toUpperCase()}${user.lastName.slice(
                1
              )}`}
            </div>
            <div className='flex flex-row gap-8 flex-wrap items-center'>
              <Avatar
                alt='Remy Sharp'
                title={`${user?.firstName || 'User'}${user?.lastName || ''}`}
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${
                  user?.firstName || 'User'
                }${user?.lastName || ''}`}
                className='shadow-lg shadow-amber-100 cursor-pointer'
              />
              <FaRegPlusSquare
                className='cursor-pointer text-3xl'
                title='Edit'
                onClick={() => setPopup(!popup)}
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
                className={`shadow-xl`}
              >
                <div className='p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow h-full animate__animated hover:animate__bounce'>
                  <h2 className='text-lg font-semibold text-gray-800'>
                    {item.title}
                  </h2>
                  <p className='text-gray-600 mt-1'>{item.description}</p>
                  <div className='mt-3 flex space-x-2'>
                    <button
                      className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer'
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className='px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer'
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
      <div
        className={`absolute w-screen h-screen top-0 left-0 bg-gray-300 opacity-75 z-50 ${
          popup
            ? 'inline animate__animated animate__zoomIn'
            : 'animate__animated animate__zoomOut hidden'
        }`}
      >
        <IoMdClose
          className='absolute right-10 top-10 text-4xl cursor-pointer'
          onClick={modalClose}
        />
        <div className='bg-gray-100 shadow-2xl shadow-black p-4 w-4/12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <p className='text-4xl font-semibold tracking-tight text-gray-800 mb-6 capitalize'>
            {editMode ? 'Edit' : 'Create'}
          </p>
          <hr />
          <form
            className='flex flex-col gap-6 items-left flex-wrap mt-6'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor='title' className='font-bold text-xl'>
                Title<sup>*</sup>
              </label>
              <input
                type='text'
                id='title'
                name='title'
                placeholder='Title'
                className='border border-black px-3 py-2 rounded-sm text-black'
                value={dataValue.title}
                onChange={handleChange}
              />
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <label htmlFor='description' className='font-bold text-xl'>
                Description<sup>*</sup>
              </label>
              <input
                type='text'
                id='description'
                name='description'
                placeholder='Description'
                value={dataValue.description}
                className='border border-black px-3 py-2 rounded-sm text-black'
                onChange={handleChange}
              />
            </div>
            <div className=''>
              <button className='px-3 py-2 font-bold text-white rounded-lg shadow-lg bg-blue-500 cursor-pointer hover:scale-95'>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
