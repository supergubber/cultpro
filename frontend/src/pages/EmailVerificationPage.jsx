import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

const EmailVerificationPage = () => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef([])
  const navigate = useNavigate()

  const { error, isLoading, verifyEmail } = useAuthStore()
  const handleChange = (index, value) => {
    const newCode = [...code]

    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('')
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || ''
      }
      setCode(newCode)

      // Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== '')
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5
      inputRefs.current[focusIndex].focus()
    } else {
      newCode[index] = value
      setCode(newCode)

      // Move focus to the next input field if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const verificationCode = code.join('')
    try {
      await verifyEmail(verificationCode)
      navigate('/login')
      // toast.success('Email verified successfully')
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if (code.every((digit) => digit !== '')) {
      handleSubmit(new Event('submit'))
    }
  }, [code])
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <div className='w-fit'>
        <h2 className='mb-6 text-3xl font-bold text-center text-black'>
          Verify Your Email
        </h2>
        <p className='mb-6 text-center text-gray-600'>
          Enter the 6-digit code sent to your email address.
        </p>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='flex justify-center gap-4'>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type='text'
                maxLength='6'
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className='w-12 h-12 text-2xl font-bold text-center text-black bg-gray-300'
              />
            ))}
          </div>
          {error && <p className='mt-2 font-semibold text-red-500'>{error}</p>}
          <button
            type='submit'
            disabled={isLoading || code.some((digit) => !digit)}
            className='w-full px-4 py-3 font-bold text-white rounded-lg shadow-lg bg-blue-500 cursor-pointer'
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmailVerificationPage
