/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 60000,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
  },
})

// Interceptor to handle errors
axiosInstance.interceptors.response.use(null, (err) => {
  const error = {
    status: err.response?.status,
    original: {},
    validation: {} as Record<string, any>,
    message: null as string | null,
  }

  if (err.response?.status === 422) {
    // Handle validation errors
    for (const field in err.response.data.errors) {
      error.validation[field] = err.response.data.errors[field][0]
    }
  } else if (err.response?.data?.message) {
    // Use the provided error message
    error.message = err.response.data.message
  } else {
    // Fallback error message
    error.message = 'Something went wrong. Please try again later'
  }

  return Promise.reject(error)
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // Retrieve token
  if (token) {
    config.headers.Authorization = token // Add Authorization header
  }
  return config
})

export default axiosInstance
