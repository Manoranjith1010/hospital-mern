import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRoleDisplay } from '../utils';

/**
 * Main Layout with navigation
 */
export const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationLinks = {
    ADMIN: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/patients', label: 'Patients' },
      { path: '/doctors', label: 'Doctors' },
      { path: '/appointments', label: 'Appointments' },
      { path: '/reports', label: 'Reports' },
    ],
    DOCTOR: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/appointments', label: 'My Appointments' },
      { path: '/patients', label: 'My Patients' },
    ],
    PATIENT: [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/doctors', label: 'Find Doctors' },
      { path: '/appointments', label: 'My Appointments' },
      { path: '/medical-records', label: 'Medical Records' },
    ],
  };

  const links = navigationLinks[user?.role] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
              🏥 Hospital System
            </Link>
            <nav className="hidden md:flex gap-6">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-blue-600 border-b-2 border-blue-600 pb-2'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.firstName}</p>
              <p className="text-xs text-gray-500">{getRoleDisplay(user?.role)}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-12">
        <p>&copy; 2024 Hospital Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

/**
 * Auth Layout for login/register pages
 */
export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">🏥</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">Hospital System</h2>
          <p className="text-gray-600 mt-1">Manage healthcare efficiently</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
