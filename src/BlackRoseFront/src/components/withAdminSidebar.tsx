import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

const withAdminSidebar = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentWithSidebar = (props: P) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleHamburgerClick = () => setSidebarOpen((open) => !open);
    const handleSidebarClose = () => setSidebarOpen(false);

    return (
      <AdminLayout
        sidebarOpen={sidebarOpen}
        onSidebarClose={handleSidebarClose}
        onHamburgerClick={handleHamburgerClick}
      >
        <WrappedComponent
          {...props}
        />
      </AdminLayout>
    );
  };

  return ComponentWithSidebar;
};

export default withAdminSidebar; 