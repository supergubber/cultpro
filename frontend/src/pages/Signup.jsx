import React, { useState } from 'react'
import { Container, Grid, Stack, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import Auth from '../assets/images/auth.svg'
import MobAuth from '../assets/images/mobile-auth.PNG'
import MediaQuery from 'react-responsive'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
const Signup = () => {
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const navigate = useNavigate()
  const { signup, error, isLoading } = useAuthStore()
  const handleChange = (e) => {
    setData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      }
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.confirmPassword
      )
      navigate('/verify-email')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Container maxWidth='lg'>
      <Grid container sx={{ height: '100%' }}>
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{
            height: { xs: '20vh', sm: '100vh' },
            display: 'flex',
            alignItems: { xs: 'end', sm: 'center' },
            justifyContent: 'center',
          }}
        >
          <MediaQuery minWidth={600}>
            <img src={Auth} alt='' width={'100%'} height={'100%'} />
          </MediaQuery>
          <MediaQuery maxWidth={600}>
            <img src={MobAuth} alt='' width={'100%'} />
          </MediaQuery>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6 }}
          sx={{
            height: { xs: 'auto', sm: '100vh' },
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div className='w-fit h-fit'>
            <Typography variant='h3' sx={{ py: { xs: 4, sm: 0 }, px: 3 }}>
              Register
            </Typography>

            <form
              onSubmit={handleSubmit}
              className='max-w-md mx-auto p-6 bg-white rounded-lg space-y-4'
            >
              <div>
                <label
                  htmlFor='firstName'
                  className='block text-sm font-medium text-gray-700'
                >
                  First Name
                </label>
                <input
                  type='text'
                  id='firstName'
                  name='firstName'
                  value={data.firstName}
                  onChange={handleChange}
                  className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='lastName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Last Name
                </label>
                <input
                  type='text'
                  id='lastName'
                  name='lastName'
                  value={data.lastName}
                  onChange={handleChange}
                  className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={data.email}
                  onChange={handleChange}
                  className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='flex gap-4'>
                <div className='w-1/2'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    name='password'
                    value={data.password}
                    onChange={handleChange}
                    className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>

                <div className='w-1/2'>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Confirm Password
                  </label>
                  <input
                    type='password'
                    id='confirmPassword'
                    name='confirmPassword'
                    value={data.confirmPassword}
                    onChange={handleChange}
                    className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition'
              >
                {isLoading ? (
                  <LoadingSpinner className='mx-auto animate-spin' size={24} />
                ) : (
                  'Sign Up'
                )}
              </button>

              <p className='text-center text-sm text-gray-600 mt-2'>
                Already have an account?{' '}
                <Link to='/login' className='text-blue-600 hover:underline'>
                  Login
                </Link>
              </p>
            </form>
            {error && (
              <p className='mt-2 font-semibold text-red-500'>{error}</p>
            )}
          </div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Signup
