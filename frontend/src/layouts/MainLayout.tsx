import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../components/Sidebar';
import { FaBars } from 'react-icons/fa';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth < 992) {
        setSidebarOpen(false);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar for Mobile */}
        <div className="top-bar d-lg-none">
          <button className="menu-btn" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className="top-bar-title">School Management System</div>
        </div>

        {/* Main Content Area */}
        <div className="content-wrapper">
          {children}
        </div>
      </div>

      <style jsx>{`
        .main-layout {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: margin-left 0.3s ease;
          min-height: 100vh;
        }

        .main-content.sidebar-open {
          margin-left: 260px;
        }

        .main-content.sidebar-closed {
          margin-left: 80px;
        }

        @media (max-width: 991.98px) {
          .main-content.sidebar-open,
          .main-content.sidebar-closed {
            margin-left: 0;
          }
        }

        .top-bar {
          position: sticky;
          top: 0;
          z-index: 1030;
          display: flex;
          align-items: center;
          padding: 1rem;
          background: white;
          border-bottom: 1px solid #dee2e6;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .menu-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #1e3a8a;
          cursor: pointer;
          padding: 0.5rem;
          margin-right: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-btn:hover {
          color: #1e40af;
        }

        .top-bar-title {
          font-weight: 600;
          font-size: 1.1rem;
          color: #1e3a8a;
        }

        .content-wrapper {
          flex: 1;
          padding: 1.5rem;
          max-width: 100%;
          overflow-x: hidden;
        }

        @media (min-width: 768px) {
          .content-wrapper {
            padding: 2rem;
          }
        }

        @media (min-width: 1200px) {
          .content-wrapper {
            padding: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;

