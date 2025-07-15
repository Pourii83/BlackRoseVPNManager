import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../services/api'
import { setAuthToken } from '../utils/auth'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    
    try {
      // درخواست به API برای لاگین
      const response = await api.post('/api/auth/login', {
        username,
        password
      })
      
      if (response.data.success) {
        setMessage(response.data.message || 'ورود موفقیت‌آمیز بود!')
        // ذخیره توکن در cookie با تنظیمات امنیتی
        setAuthToken(response.data.token)
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        setMessage(response.data.message || 'خطا در ورود')
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // خطای سرور
          setMessage(error.response.data.message || 'خطا در ارتباط با سرور')
        } else if (error.request) {
          // خطای شبکه
          setMessage('خطا در اتصال به سرور')
        } else {
          // خطای دیگر
          setMessage('خطای غیرمنتظره رخ داد')
        }
      } else {
        setMessage('خطای غیرمنتظره رخ داد')
      }
      console.error('خطا در لاگین:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">🌹</div>
            </div>
            <h1 className="login-title">خوش آمدید</h1>
            <p className="login-subtitle">لطفاً برای ادامه وارد شوید</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="text"
                  placeholder="نام کاربری"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="login-input"
                  autoFocus
                  required
                />
                <div className="input-icon">👤</div>
              </div>
            </div>
            
            <div className="input-group">
              <div className="input-wrapper">
                <input
                  type="password"
                  placeholder="رمز عبور"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="login-input"
                  required
                />
                <div className="input-icon">🔒</div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>در حال ورود...</span>
                </div>
              ) : (
                'ورود'
              )}
            </button>
            
            {message && (
              <div className={`message ${message.includes('موفق') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </form>
          
          <div className="login-footer">
            <div className="made-with-love">
              <p>Black Rose (v1.0.0) ساخته شده با ❤️ و ☕</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 