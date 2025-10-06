// src/components/Header.jsx

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// Make sure to import the new logoutAdmin function
import { logoutAdmin } from '../api/apiService'; 
import { FaBed, FaBars, FaTimes, FaCalendarAlt, FaUserCircle } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setShowProfileMenu(false);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-lg transition-colors ${
          isActive ? "text-blue-600 font-semibold" : "text-gray-700 hover:text-blue-600"
        }`
      }
      onClick={() => setToggleMenu(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="bg-white text-black border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-8">
            <NavLink to="/admin/dashboard" className="flex-shrink-0 flex items-center gap-2">
              <FaBed className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-800">HMS</span>
            </NavLink>
            <div className="hidden md:flex items-center space-x-6">
              <NavItem to="/admin/dashboard">Dashboard</NavItem>
              <NavItem to="/admin/students">Students</NavItem>
              <NavItem to="/admin/rooms">Rooms</NavItem>
              <NavItem to="/admin/complaints">Complaints</NavItem>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2 relative">
            <button onClick={() => setShowCalendar(!showCalendar)} className="p-2 rounded-full hover:bg-gray-200">
              <FaCalendarAlt size={20} className="text-gray-600" />
            </button>
            
            <div className="relative">
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-2 rounded-full hover:bg-gray-200">
                <FaUserCircle size={22} className="text-gray-600" />
              </button>

              {showProfileMenu && (
                <div className="absolute top-12 right-0 w-48 bg-white border rounded-lg shadow-lg py-1">
                  <NavLink
                    to="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    View Profile
                  </NavLink>
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {showCalendar && (
              <div className="absolute top-12 right-0 bg-white border rounded-lg shadow-lg">
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} inline />
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setToggleMenu(!toggleMenu)}>
              {toggleMenu ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`md:hidden bg-white border-t overflow-hidden transition-all duration-300 ${toggleMenu ? "max-h-96 py-2" : "max-h-0"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavItem to="/admin/dashboard">Dashboard</NavItem>
          <NavItem to="/admin/students">Students</NavItem>
          <NavItem to="/admin/rooms">Rooms</NavItem>
          <NavItem to="/admin/complaints">Complaints</NavItem>
          <div className="border-t my-2"></div>
          <NavLink to="/admin/profile" className="flex items-center gap-2 text-gray-700 p-2 rounded-md hover:bg-gray-100">
            <FaUserCircle size={22} /> Profile
          </NavLink>
          <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 text-red-600 p-2 rounded-md hover:bg-gray-100">
             Logout
          </button>
          <div className="p-2 border-t mt-2">
             <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="w-full p-2 border rounded-md" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;