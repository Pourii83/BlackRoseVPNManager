import axios from 'axios'
import { getAuthToken, removeAuthToken } from '../utils/auth'

// تنظیمات پایه axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5073',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor برای اضافه کردن توکن به درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor برای مدیریت خطاها
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // حذف توکن منقضی شده
      removeAuthToken()
      // ریدایرکت به صفحه لاگین
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api 