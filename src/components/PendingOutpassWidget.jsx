// src/components/PendingOutpassWidget.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllOutpasses } from '../api/apiService';
import { FiArrowRight, FiClipboard } from 'react-icons/fi';

function PendingOutpassWidget() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const allRequests = await getAllOutpasses();
        // Filter for "Pending" requests and get the most recent ones
        const pending = allRequests.filter(pass => pass.status === 'Pending').slice(0, 4);
        setPendingRequests(pending);
      } catch (error) {
        console.error("Failed to fetch out pass requests for widget:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPending();
  }, []);

  if (isLoading) {
    return <div className="bg-white p-6 rounded-lg shadow-md border"><p>Loading Requests...</p></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border flex flex-col">
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