import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  FaTachometerAlt,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaBook,
  FaClipboardList,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
  FaBookOpen,
  FaUserCheck,
  FaFileAlt
} from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const router = useRouter();

  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <FaTachometerAlt className="nav-icon" />
    },
    {
      label: 'Student Management',
      path: '/students',
      icon: <FaUserGraduate className="nav-icon" />
    },
    {
      label: 'Teacher Management',
      path: '/teachers',
      icon: <FaChalkboardTeacher className="nav-icon" />
    },
    {
      label: 'Class Management',
      path: '/admin/classes',
      icon: <FaUsers className="nav-icon" />
    },
    {
      label: 'Attendance',
      path: '/attendance',
      icon: <FaUserCheck className="nav-icon" />
    },
    {
      label: 'Attendance Reports',
      path: '/attendance-reports',
      icon: <FaFileAlt className="nav-icon" />
    },
    {
      label: 'Accounts',
      path: '/accounts',
      icon: <FaMoneyBillWave className="nav-icon" />
    },
    {
      label: 'Fee Management',
      path: '/fee-management',
      icon: <FaMoneyBillWave className="nav-icon" />
    },
    {
      label: 'Library Management',
      path: '/library',
      icon: <FaBook className="nav-icon" />
    },
    {
      label: 'Examination',
      path: '/admin/exams',
      icon: <FaClipboardList className="nav-icon" />
    },
    {
      label: 'Reports',
      path: '/admin/reports',
      icon: <FaChartBar className="nav-icon" />
    }
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/dashboard') {
      return router.pathname === '/dashboard' || router.pathname === '/';
    }
    return router.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaBookOpen className="logo-icon" />
            {isOpen && <span className="logo-text">School MS</span>}
          </div>
          <button
            className="sidebar-toggle-btn d-none d-lg-block"
            onClick={onToggle}
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
          <button
            className="sidebar-close-btn d-lg-none"
            onClick={onToggle}
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* User Info */}
        {isOpen && (
          <div className="sidebar-user">
            <FaUserCircle className="user-avatar" />
            <div className="user-info">
              <div className="user-name">Admin User</div>
              <div className="user-role">Administrator</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-list">
            {navigationItems.map((item) => {
              const active = isActiveRoute(item.path);
              return (
                <li key={item.path} className="nav-item">
                  <a
                    className={`nav-link ${active ? 'active' : ''}`}
                    title={!isOpen ? item.label : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(item.path);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.icon}
                    {isOpen && <span className="nav-label">{item.label}</span>}
                    {active && <div className="active-indicator" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title={!isOpen ? 'Logout' : ''}
          >
            <FaSignOutAlt className="nav-icon" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <style jsx>{`
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1040;
          display: none;
        }

        @media (max-width: 991.98px) {
          .sidebar-overlay {
            display: block;
          }
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
          color: white;
          z-index: 1050;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar-open {
          width: 260px;
        }

        .sidebar-closed {
          width: 80px;
        }

        @media (max-width: 991.98px) {
          .sidebar {
            transform: translateX(-100%);
          }
          
          .sidebar-open {
            transform: translateX(0);
            width: 260px;
          }
        }

        .sidebar-header {
          padding: 1.5rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 70px;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
        }

        .logo-icon {
          font-size: 1.75rem;
          color: #60a5fa;
        }

        .logo-text {
          white-space: nowrap;
        }

        .sidebar-toggle-btn,
        .sidebar-close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sidebar-toggle-btn:hover,
        .sidebar-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sidebar-user {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          font-size: 2.5rem;
          color: #60a5fa;
          flex-shrink: 0;
        }

        .user-info {
          overflow: hidden;
        }

        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 1rem 0;
        }

        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar-nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .nav-item {
          margin: 0.25rem 0.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 0.875rem 1rem;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s;
          position: relative;
          gap: 0.875rem;
          font-size: 0.95rem;
        }

        .sidebar-closed .nav-link {
          justify-content: center;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          transform: translateX(2px);
        }

        .nav-link.active {
          background: rgba(96, 165, 250, 0.2);
          color: white;
          font-weight: 600;
        }

        .nav-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .nav-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .active-indicator {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 70%;
          background: #60a5fa;
          border-radius: 0 4px 4px 0;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(239, 68, 68, 0.2);
          border: none;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .sidebar-closed .logout-btn {
          justify-content: center;
        }

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          transform: translateX(2px);
        }
      `}</style>
    </>
  );
};

export default Sidebar;

