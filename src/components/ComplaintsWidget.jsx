// src/components/ComplaintsWidget.jsx

import React, { useState, useEffect } from 'react';
import { getComplaints } from '../api/apiService';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton'; // 1. Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

// Skeleton Loader Component
const ComplaintSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border">
    <h3 className="text-lg font-semibold text-gray-700 mb-4"><Skeleton width={180} /></h3>
    <div className="flex justify-around items-center">
      <div className="text-center">
        <Skeleton circle={true} height={28} width={28} className="mx-auto" />
        <p className="mt-2"><Skeleton width={50} height={30} /></p>
        <p className="text-sm text-gray-500"><Skeleton width={40} /></p>
      </div>
      <div className="text-center">
        <Skeleton circle={true} height={28} width={28} className="mx-auto" />
        <p className="mt-2"><Skeleton width={50} height={30} /></p>
        <p className="text-sm text-gray-500"><Skeleton width={50} /></p>
      </div>
    </div>
  </div>
);


function ComplaintsWidget() {
  const [summary, setSummary] = useState({ open: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessComplaints = async () => {
      setIsLoading(true); // Ensure loading starts
      try {
        const complaints = await getComplaints();
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
  }, []); // Empty dependency array means this runs once on mount

  // Render Skeleton while loading
  if (isLoading) {
    return <ComplaintSkeleton />;
  }

  // Render actual content when loaded
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