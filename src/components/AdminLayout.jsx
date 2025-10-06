// src/components/AdminLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      <Header />
      
      <main className="max-w-7xl mx-auto p-6">
        {/* All admin pages like Dashboard, Students, etc., will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;