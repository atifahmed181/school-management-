import { ReactNode, useContext } from 'react';
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
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }
  
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="py-6">
        {children}
      </main>
    </div>
  );
}