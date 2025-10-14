// src/components/ComplaintsWidget.jsx

import React, { useState, useEffect } from 'react';
import { getComplaints } from '../api/apiService';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

function ComplaintsWidget() {
  const [summary, setSummary] = useState({ open: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessComplaints = async () => {
      try {
        const complaints = await getComplaints();
        
        // This logic counts the complaints by status
        const openCount = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress').length;
        const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
        
        setSummary({ open: openCount, resolved: resolvedCount });
      } catch (error) {
        console.error("Failed to fetch complaints for widget:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAndProcessComplaints();
  }, []);

  if (isLoading) {
    return <div className="bg-white p-6 rounded-lg shadow-md border"><p>Loading Complaints...</p></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Complaints Summary</h3>
      <div className="flex justify-around items-center">
        <div className="text-center">
          <FiAlertCircle className="text-yellow-500 mx-auto" size={28} />
          <p className="text-3xl font-bold mt-2">{summary.open}</p>
          <p className="text-sm text-gray-500">Open</p>
        </div>
        <div className="text-center">
          <FiCheckCircle className="text-green-500 mx-auto" size={28} />
          <p className="text-3xl font-bold mt-2">{summary.resolved}</p>
          <p className="text-sm text-gray-500">Resolved</p>
        </div>
      </div>
    </div>
  );
}

export default ComplaintsWidget;