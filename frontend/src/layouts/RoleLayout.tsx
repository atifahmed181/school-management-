import { ReactNode, useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

export default function RoleLayout({
  allowedRoles,
  children
}: {
  allowedRoles: string[];
  children: ReactNode;
}) {
  const { user } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="h2 text-dark mb-2">Please Log In</h2>
          <p className="text-muted">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }
  
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-light d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h2 className="h2 text-danger mb-2">Access Denied</h2>
          <p className="text-muted">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navigation isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="main-content">
        {children}
      </main>
      
      <style jsx>{`
        .main-content {
          margin-left: 0;
          padding: 2rem 1rem;
          min-height: 100vh;
        }
        
        @media (min-width: 992px) {
          .main-content {
            margin-left: 250px;
          }
        }
      `}</style>
    </div>
  );
}