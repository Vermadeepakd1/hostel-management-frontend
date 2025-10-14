// src/pages/AdminDashboardPage.jsx

import React from 'react';
import OccupancyWidget from '../components/OccupancyWidget';
import StudentChartWidget from '../components/StudentChartWidget';
import ComplaintsWidget from '../components/ComplaintsWidget';

function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top row with charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyWidget />
        <StudentChartWidget />
      </div>
      
      {/* Bottom row now only contains the Complaints Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComplaintsWidget />
      </div>
    </div>
  );
}

export default AdminDashboardPage;