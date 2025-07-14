import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/')
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">🌹 داشبورد Black Rose</h1>
          <button onClick={handleLogout} className="logout-button">
            خروج
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>خوش آمدید به سیستم!</h2>
          <p>شما با موفقیت وارد شده‌اید.</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <h3>آمار کلی</h3>
            <p className="stat-number">1,234</p>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>کاربران</h3>
            <p className="stat-number">567</p>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <h3>رشد</h3>
            <p className="stat-number">+23%</p>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <h3>عملکرد</h3>
            <p className="stat-number">98%</p>
          </div>
        </div>
        
        <div className="recent-activity">
          <h3>فعالیت‌های اخیر</h3>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <span className="activity-text">ورود موفقیت‌آمیز کاربر</span>
              <span className="activity-time">2 دقیقه پیش</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">📝</span>
              <span className="activity-text">بروزرسانی پروفایل</span>
              <span className="activity-time">15 دقیقه پیش</span>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🔔</span>
              <span className="activity-text">اعلان جدید دریافت شد</span>
              <span className="activity-time">1 ساعت پیش</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 