import React from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  onSidebarClose: () => void;
  onHamburgerClick: () => void;
  title?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  sidebarOpen,
  onSidebarClose,
  onHamburgerClick,
  title = '🌹 داشبورد Black Rose',
}) => {
  const handleLogout = () => {
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-layout">
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
          <div className="shape shape-7"></div>
          <div className="shape shape-8"></div>
        </div>
      </div>
      <div className="dashboard-main-content">
        <div className="dashboard-header">
          <div className="header-content">
            <button className="hamburger-btn" onClick={onHamburgerClick} aria-label="باز کردن منو">
              <span className="hamburger-icon" />
            </button>
            <h1 className="dashboard-title">{title}</h1>
          </div>
        </div>
        {children}
      </div>
      <aside className={`dashboard-sidebar${sidebarOpen ? ' open' : ''}`} onClick={onSidebarClose}>
        <nav className="sidebar-menu" onClick={e => e.stopPropagation()}>
          <ul>
            <li className="menu-item active">داشبورد</li>
            <li className="menu-item">کاربران</li>
            <li className="menu-item">تنظیمات</li>
            <li className="menu-item" onClick={handleLogout}>خروج</li>
          </ul>
        </nav>
      </aside>
      {sidebarOpen && <div className="sidebar-backdrop" onClick={onSidebarClose}></div>}
    </div>
  );
};

export default AdminLayout; 