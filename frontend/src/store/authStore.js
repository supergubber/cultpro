import { create } from 'zustand'
import axios from 'axios'

const API_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api/v1/auth'
    : '/api/v1/auth'

axios.defaults.withCredentials = true

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  Todo: [],
  signup: async (firstName, lastName, email, password, confirmPassword) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      })
      set({ user: response.data.user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({
        error: error.response.data.message || 'Error signing up',
        isLoading: false,
      })

      throw error
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      })
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error signing up',
        isLoading: false,
      })

      throw error
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null })
    try {
      await axios.post(`${API_URL}/logout`)
      set({ user: null, isAuthenticated: false, error: null, isLoading: false })
    } catch (error) {
      set({ error: 'Error logging out', isLoading: false })
      throw error
    }
  },
  checkAuth: async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    set({ isCheckingAuth: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/check-auth`)
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      })
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false })
      throw error
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code })
      set({ user: response.data.user, isAuthenticated: true, isLoading: false })
      return response.data
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error verifying email',
        isLoading: false,
      })
      throw error
    }
  },
  fetchTodos: async () => {
    set({ isLoading: true })
    try {
      const response = await axios.get(`${API_URL}/getTodo`)
      set({
        todos: response.data.data, // assumes backend sends todos under data
        isLoading: false,
      })
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error fetching todos'
      set({ error: errorMessage, isLoading: false })
      throw new Error(errorMessage)
    }
  },

  createTodo: async (title, description) => {
    set({ isLoading: true })
    try {
      const response = await axios.post(`${API_URL}/createTodo`, {
        title,
        description,
      })
      set((state) => ({
        todos: [...state.todos, response.data.data],
        isLoading: false,
        message: 'Todo created successfully!',
      }))
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error creating todo'
      set({ error: errorMessage, isLoading: false })
      throw new Error(errorMessage)
    }
  },

  updateTodo: async (id, updatedData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.put(
        `${API_URL}/updatedTodo/${id}`,
        updatedData
      )
      const updatedTodo = response.data.data

      set((state) => ({
        todos: state.todos.map((todo) =>
          todo._id === id ? { ...todo, ...updatedTodo } : todo
        ),
        isLoading: false,
        message: 'Todo updated successfully!',
      }))
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error updating todo'
      set({ error: errorMessage, isLoading: false })
      throw new Error(errorMessage)
    }
  },

  deleteTodo: async (id) => {
    set({ isLoading: true })
    try {
      await axios.delete(`${API_URL}/deleteTodo/${id}`)
      set((state) => ({
        todos: state.todos.filter((todo) => todo._id !== id),
        isLoading: false,
        message: 'Todo deleted successfully!',
      }))
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Error deleting todo'
      set({ error: errorMessage, isLoading: false })
      throw new Error(errorMessage)
    }
  },
}))
