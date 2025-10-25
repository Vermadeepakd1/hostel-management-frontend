// src/components/AdminLayout.jsx

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import IIITDMLogo from '../assets/iiitdm_kurnool_logo.jpeg';

function AdminLayout() {
  const navigate = useNavigate();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const NavItemMobile = ({ to, children }) => ( // Renamed for clarity
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
          isActive 
            ? "text-blue-600 bg-blue-50 font-semibold" 
            : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
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
              <Link to="/admin/dashboard" className="flex items-center space-x-2">
                <img src={IIITDMLogo} alt="IIITDM Kurnool Logo" className="h-9 w-auto" />
                <span className="font-bold text-xl text-gray-800">Admin Portal</span>
              </Link>
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                 <NavLink to="/admin/dashboard" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Dashboard</NavLink>
                 <NavLink to="/admin/students" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Students</NavLink>
                 <NavLink to="/admin/rooms" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Rooms</NavLink>
                 <NavLink to="/admin/complaints" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Complaints</NavLink>
                 <NavLink to="/admin/announcements" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Announcements</NavLink>
                 <NavLink to="/admin/outpasses" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Out Passes</NavLink>
                 <NavLink to="/admin/fees" className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Fees</NavLink>
              </div>
            </div>
            {/* Right side: Desktop Icons */}
            <div className="hidden md:flex items-center space-x-2 relative">
              <button onClick={() => setShowCalendar(!showCalendar)} className="p-2 rounded-full hover:bg-gray-200">
                <FaCalendarAlt size={20} className="text-gray-600" />
              </button>
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-2 rounded-full hover:bg-gray-200">
                  <FaUserCircle size={22} className="text-gray-600" />
                </button>
                {/* 👇 THIS IS THE CORRECTED BLOCK */}
                {showProfileMenu && (
                  <div className="absolute top-12 right-0 w-48 bg-white border rounded-lg shadow-lg py-1">
                    {/* The View Profile Link remains commented out */}
                    {/*
                    <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      View Profile
                    </Link>
                    */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
                {/* END OF CORRECTED BLOCK */}
              </div>
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
            <NavItemMobile to="/admin/dashboard">Dashboard</NavItemMobile>
            <NavItemMobile to="/admin/students">Students</NavItemMobile>
            <NavItemMobile to="/admin/rooms">Rooms</NavItemMobile>
            <NavItemMobile to="/admin/complaints">Complaints</NavItemMobile>
            <NavItemMobile to="/admin/announcements">Announcements</NavItemMobile>
            <NavItemMobile to="/admin/outpasses">Out Passes</NavItemMobile>
            <NavItemMobile to="/admin/fees">Fees</NavItemMobile>
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
      
      {/* Moved Calendar Popup outside main structure for proper positioning */}
      {showCalendar && (
        <div className="fixed top-16 right-4 z-50">
             <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                  <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} inline />
             </div>
        </div>
       )}
    </div>
  );
}

export default AdminLayout;