// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin, loginStudent } from '../api/apiService';
import { FiEye, FiEyeOff } from 'react-icons/fi';

// The logo is still imported from assets, which is correct.
import CollegeLogo from '../assets/iiitdm_kurnool_logo.jpeg';
// The background image is no longer imported.

function LoginPage() {
  const [userType, setUserType] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (userType === 'student') {
        await loginStudent(identifier, password);
        navigate('/student/dashboard');
      } else {
        await loginAdmin(identifier, password);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center font-sans"
      style={{ backgroundImage: `url(/Hostel_image.png)` }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Login Form Container */}
      <div className="relative bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        
        <div className="flex flex-col items-center mb-6">
          <img src={CollegeLogo} alt="College Logo" className="h-20 w-auto mb-4" />
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Hostel Management System
          </h2>
          <p className="text-gray-500 mt-2">Please sign in to continue</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <p className="bg-red-100 text-red-700 text-center p-3 rounded-md mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
            <select
              value={userType}
              onChange={(e) => { setUserType(e.target.value); setError(''); setIdentifier(''); }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
             <label className="block text-sm font-medium text-gray-700 mb-1">
                {userType === 'student' ? 'Roll Number' : 'Admin Username'}
             </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
             <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             <div className="relative">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                >
                  {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                </button>
             </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;