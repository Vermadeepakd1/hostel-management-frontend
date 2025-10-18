// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getStudentProfile, getAdminProfile } from '../api/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'student' or 'admin'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      // We assume the cookie is already there. We just need to verify it.
      // We'll try fetching both profiles. The one that succeeds tells us the user type.
      try {
        const adminProfile = await getAdminProfile();
        setUser(adminProfile);
        setUserType('admin');
      } catch (adminError) {
        try {
          const studentProfile = await getStudentProfile();
          setUser(studentProfile);
          setUserType('student');
        } catch (studentError) {
          // If both fail, no one is logged in.
          setUser(null);
          setUserType(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = (userData, type) => {
    setUser(userData);
    setUserType(type);
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    // You would also call an API logout endpoint here to clear the cookie
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the context
export const useAuth = () => {
  return useContext(AuthContext);
};