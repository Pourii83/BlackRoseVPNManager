import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // شبیه‌سازی تأخیر شبکه
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (username === 'admin' && password === '1234') {
      setMessage('ورود موفقیت‌آمیز بود!')
      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)
    } else {
      setMessage('نام کاربری یا رمز عبور اشتباه است.')
    }
    setIsLoading(false)
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
              <p>ساخته شده با ❤️ و ☕</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 