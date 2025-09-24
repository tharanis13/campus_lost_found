import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, User, LogOut, Home } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LF</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Campus Lost & Found</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`flex items-center space-x-1 ${
                location.pathname === '/' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link 
              to="/search" 
              className={`flex items-center space-x-1 ${
                location.pathname === '/search' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search size={18} />
              <span>Search</span>
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-1 ${
                  location.pathname === '/dashboard' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={18} />
                <span>Dashboard</span>
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`flex items-center space-x-1 ${
                  location.pathname === '/admin' ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* User actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;