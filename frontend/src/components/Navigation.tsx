import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navigation() {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Classes', href: '/admin/classes', icon: '🏫' },
    { name: 'Students', href: '/admin/students', icon: '👨‍🎓' },
    { name: 'Staff', href: '/admin/staff', icon: '👨‍🏫' },
    { name: 'Attendance', href: '/admin/attendance', icon: '📝' },
    { name: 'Subjects', href: '/admin/subjects', icon: '📚' },
    { name: 'Exams', href: '/admin/exams', icon: '📋' },
    { name: 'Fees', href: '/admin/fees', icon: '💰' },
    { name: 'Reports', href: '/admin/reports', icon: '📈' },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">School Management</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    router.pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <span>
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 