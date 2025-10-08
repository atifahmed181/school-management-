import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface NavigationProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/teachers', label: 'Teachers', icon: '👨‍🏫' },
    { path: '/classes', label: 'Classes', icon: '📚' },
    { path: '/attendance', label: 'Attendance', icon: '📅' },
    { path: '/grades', label: 'Grades', icon: '📊' },
    { path: '/fees', label: 'Fees', icon: '💰' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="btn btn-outline-secondary d-lg-none position-fixed"
        style={{ top: '10px', left: '10px', zIndex: 1050 }}
        onClick={onToggle}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h4 className="text-white">School ERP</h4>
        </div>
        
        <nav className="sidebar-nav">
          <ul className="nav flex-column">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <a
                  className={`nav-link ${router.pathname === item.path ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.path);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <span className="me-2">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button 
            className="btn btn-outline-light w-100"
            onClick={handleLogout}
          >
            <span className="me-2">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="sidebar-overlay d-lg-none"
          onClick={onToggle}
        ></div>
      )}

      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 250px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 1040;
          display: flex;
          flex-direction: column;
        }

        .sidebar.show {
          transform: translateX(0);
        }

        .sidebar-header {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem 0;
        }

        .sidebar-nav .nav-link {
          color: rgba(255, 255, 255, 0.8);
          padding: 0.75rem 1.5rem;
          border: none;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          text-decoration: none;
        }

        .sidebar-nav .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-nav .nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          border-right: 3px solid white;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1035;
        }

        @media (min-width: 992px) {
          .sidebar {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default Navigation;