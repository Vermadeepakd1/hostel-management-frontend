// src/components/StudentLayout.jsx

import React, { useState } from 'react'; // Import useState
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa'; // Import FaBars, FaTimes
import IIITDMLogo from '../assets/iiitdm_kurnool_logo.jpeg'; 

function StudentLayout() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    setIsMobileMenuOpen(false); // Close menu on logout
    navigate('/login');
  };

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        // Added styling for mobile menu links
        `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
          isActive 
            ? "text-blue-600 bg-blue-50 font-semibold" 
            : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
    >
      {children}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      <header className="bg-white text-black border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side: Logo and Desktop Nav */}
            <div className="flex items-center gap-8">
              <Link to="/student/dashboard" className="flex items-center space-x-2">
                <img src={IIITDMLogo} alt="IIITDM Kurnool Logo" className="h-9 w-auto" />
                <span className="font-bold text-xl text-gray-800">Student Portal</span>
              </Link>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                 <NavLink to="/student/dashboard" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Dashboard</NavLink>
                 <NavLink to="/student/fees" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>My Fees</NavLink>
                 <NavLink to="/student/complaints" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>My Complaints</NavLink>
                 <NavLink to="/student/profile" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>My Profile</NavLink>
                 <NavLink to="/student/menu" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Mess Menu</NavLink>
                 <NavLink to="/student/announcements" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Announcements</NavLink>
                 <NavLink to="/student/outpass" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Out Pass</NavLink>
              </div>
            </div>
            {/* Right side: Desktop Logout Button */}
            <div className="hidden md:flex items-center">
                <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600">
                    <FaUserCircle size={22} />
                    <span>Logout</span>
                </button>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            <NavItem to="/student/dashboard">Dashboard</NavItem>
            <NavItem to="/student/fees">My Fees</NavItem>
            <NavItem to="/student/complaints">My Complaints</NavItem>
            <NavItem to="/student/profile">My Profile</NavItem>
            <NavItem to="/student/menu">Mess Menu</NavItem>
            <NavItem to="/student/announcements">Announcements</NavItem>
            <NavItem to="/student/outpass">Out Pass</NavItem>
            <div className="border-t my-2"></div>
            <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default StudentLayout;