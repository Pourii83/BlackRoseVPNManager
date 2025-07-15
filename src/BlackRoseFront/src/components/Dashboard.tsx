import { useNavigate } from 'react-router-dom';
import withAdminSidebar from './withAdminSidebar';
import SystemMonitor from './SystemMonitor';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="dashboard-content">
      <SystemMonitor />
      
    </div>
  );
}

export default withAdminSidebar(Dashboard); 