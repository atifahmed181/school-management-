import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">School Management System</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
} 