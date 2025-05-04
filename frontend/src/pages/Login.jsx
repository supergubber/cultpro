import React, { useState } from 'react'
import { Container, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import Auth from '../assets/images/auth.svg'
import MobAuth from '../assets/images/mobile-auth.PNG'
import MediaQuery from 'react-responsive'
import { useAuthStore } from '../store/authStore'
import LoadingSpinner from '../components/LoadingSpinner'
const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const { login, isLoading, error } = useAuthStore()

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
    await login(data.email, data.password)
  }
  return (
    <Container maxWidth='lg'>
      <Grid container sx={{ height: '100%' }} className='w-fit'>
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
          <div className='w-fit h-fit pb-36'>
            <Typography variant='h3' sx={{ py: { xs: 4, sm: 0 }, px: 3 }}>
              Login
            </Typography>

            <form
              onSubmit={handleSubmit}
              className='w-[500px] p-6 rounded-lg space-y-4 '
            >
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
              <div>
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

              <button
                type='submit'
                className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition'
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner className='w-6 h-6 mx-auto text-center animate-spin' />
                ) : (
                  'Login'
                )}
              </button>

              <p className='text-center text-sm text-gray-600 mt-2'>
                Create And Account?{' '}
                <Link to='/signup' className='text-blue-600 hover:underline'>
                  Signup
                </Link>
              </p>
            </form>
            {error && (
              <p className='mb-4 text-sm font-semibold text-red-500'>{error}</p>
            )}
          </div>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Login
