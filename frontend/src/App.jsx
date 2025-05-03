import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Notfound from './pages/Notfound'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import DashboardPage from './pages/DashboardPage'
import EmailVerificationPage from './pages/EmailVerificationPage'
import LoadingSpinner from './components/LoadingSpinner'
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />
  }

  return children
}

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }

  return children
}
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <LoadingSpinner />
  return (
    <>
      <div>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path='/signup'
            element={
              <RedirectAuthenticatedUser>
                <Signup />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path='/login'
            element={
              <RedirectAuthenticatedUser>
                <Login />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path='/verify-email' element={<EmailVerificationPage />} />
          {/* <Route path='/' element={<Signup />} />
          <Route path='/login' element={<Login />} /> */}
          <Route path='*' element={<Notfound />} />
        </Routes>
      </div>
    </>
  )
}

export default App
