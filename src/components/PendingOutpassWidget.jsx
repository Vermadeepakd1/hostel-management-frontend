// src/components/PendingOutpassWidget.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOutpasses } from '../api/apiService';
import { FiArrowRight, FiClipboard } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton'; // 1. Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

// Skeleton Loader Component
const PendingOutpassSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-md border flex flex-col">
    <h3 className="text-lg font-semibold text-gray-700 mb-4"><Skeleton width={220} /></h3>
    <div className="flex-grow space-y-3">
      {/* Render 3 placeholder list items */}
      {[1, 2, 3].map(i => (
        <div key={i} className="text-sm">
          <p className="font-semibold text-gray-800"><Skeleton width={180} /></p>
          <p className="text-gray-500 truncate"><Skeleton width={150} /></p>
        </div>
      ))}
    </div>
    <div className="mt-4 self-end">
      <Skeleton width={80} height={20} />
    </div>
  </div>
);


function PendingOutpassWidget() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      setIsLoading(true); // Ensure loading state is set
      try {
        const allRequests = await getAllOutpasses();
        const pending = allRequests.filter(pass => pass.status === 'Pending').slice(0, 4); // Show max 4
        setPendingRequests(pending);
      } catch (error) {
        console.error("Failed to fetch out pass requests for widget:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, []); // Empty dependency array means this runs once on mount

  // Render Skeleton while loading
  if (isLoading) {
    return <PendingOutpassSkeleton />;
  }

  // Render actual content when loaded
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border flex flex-col h-full"> {/* Added h-full */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Pending Out Pass Requests</h3>
      <div className="flex-grow space-y-3">
        {pendingRequests.length > 0 ? (
          pendingRequests.map(pass => (
            <div key={pass.id} className="text-sm">
              <p className="font-semibold text-gray-800">{pass.student_name} ({pass.room_no})</p>
              <p className="text-gray-500 truncate">{pass.reason}</p>
            </div>
          ))
        ) : (
          // Use flex-grow to push "No pending requests" down if the list is empty
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500">No pending requests.</p>
          </div>
        )}
      </div>
      <Link to="/admin/outpasses" className="text-blue-600 hover:underline mt-4 text-sm font-semibold flex items-center self-end">
        View All <FiArrowRight className="ml-1" />
      </Link>
    </div>
  );
}

export default PendingOutpassWidget;