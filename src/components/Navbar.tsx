import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Code, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-indigo-700 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8" />
            <span className="text-xl font-bold">API Tester</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" isActive={isActive('/')}>
              <LayoutDashboard className="h-5 w-5 mr-1" />
              Dashboard
            </NavLink>
            <NavLink to="/test-builder" isActive={isActive('/test-builder')}>
              <Code className="h-5 w-5 mr-1" />
              Test Builder
            </NavLink>
            <NavLink to="/test-results" isActive={isActive('/test-results')}>
              <BarChart2 className="h-5 w-5 mr-1" />
              Results
            </NavLink>
            <NavLink to="/settings" isActive={isActive('/settings')}>
              <Settings className="h-5 w-5 mr-1" />
              Settings
            </NavLink>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center space-x-1 bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, isActive, children }: { to: string; isActive: boolean; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        isActive ? 'bg-indigo-800' : 'hover:bg-indigo-600'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;