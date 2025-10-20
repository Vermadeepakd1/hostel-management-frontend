// src/components/AdminLayout.jsx

import React, { useState } from 'react'; // 1. Import useState
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker'; // 2. Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import its styles
import IIITDMLogo from '../assets/iiitdm_kurnool_logo.jpeg';

function AdminLayout() {
  const navigate = useNavigate();
  // 3. Add state for the popups
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

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
              <Link to="/admin/dashboard" className="flex items-center space-x-2">
                <img src={IIITDMLogo} alt="IIITDM Kurnool Logo" className="h-9 w-auto" />
                <span className="font-bold text-xl text-gray-800">Admin Portal</span>
              </Link>
              <div className="hidden md:flex items-center space-x-6">
                <NavItem to="/admin/dashboard">Dashboard</NavItem>
                <NavItem to="/admin/students">Students</NavItem>
                <NavItem to="/admin/rooms">Rooms</NavItem>
                <NavItem to="/admin/complaints">Complaints</NavItem>
                <NavItem to="/admin/announcements">Announcements</NavItem>
                <NavItem to="/admin/outpasses">Out Passes</NavItem>
                <NavItem to="/admin/fees">Fees</NavItem>
              </div>
            </div>
            {/* 4. UPDATED Right side icons with popups */}
            <div className="hidden md:flex items-center space-x-2 relative">
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FaCalendarAlt size={20} className="text-gray-600" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <FaUserCircle size={22} className="text-gray-600" />
                </button>

                {showProfileMenu && (
                  <div className="absolute top-12 right-0 w-48 bg-white border rounded-lg shadow-lg py-1">
                    {/* <Link
                      to="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      View Profile
                    </Link> */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {showCalendar && (
                <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    inline
                  />
                </div>
              )}
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

export default AdminLayout;