// src/components/StudentLayout.jsx

import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom'; // Import Link
import { FaUserCircle } from 'react-icons/fa';
// 1. Import your college logo
import IIITDMLogo from '../assets/iiitdm_kurnool_logo.jpeg'; 

function StudentLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-lg transition-colors ${
          isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      <header className="bg-white text-black border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              {/* 2. Replace the old Student Portal text with the new one */}
              <Link to="/student/dashboard" className="flex items-center space-x-2">
                <img src={IIITDMLogo} alt="IIITDM Kurnool Logo" className="h-9 w-auto" /> {/* Adjust height as needed */}
                <span className="font-bold text-xl text-gray-800">Student Portal</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <NavItem to="/student/dashboard">Dashboard</NavItem>
                <NavItem to="/student/fees">My Fees</NavItem>
                <NavItem to="/student/complaints">My Complaints</NavItem>
                <NavItem to="/student/profile">My Profile</NavItem>
                <NavItem to="/student/menu">Mess Menu</NavItem>
                <NavItem to="/student/announcements">Announcements</NavItem>
                <NavItem to="/student/outpass">Out Pass</NavItem>
              </div>
            </div>
            <div className="flex items-center">
                <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <FaUserCircle size={22} />
                    <span>Logout</span>
                </button>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;