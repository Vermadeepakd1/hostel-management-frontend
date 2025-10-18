// src/pages/AdminOutpassPage.jsx

import React, { useState, useEffect } from 'react';
import { getAllOutpasses, updateOutpassStatus } from '../api/apiService';

function AdminOutpassPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getAllOutpasses();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch out pass requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    try {
      await updateOutpassStatus(id, status);
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error(`Failed to ${status} request:`, error);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status]}`}>{status}</span>;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Out Pass Requests</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Return</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? <tr><td colSpan="6" className="text-center py-4">Loading requests...</td></tr> : requests.map(pass => (
              <tr key={pass.id}>
                <td className="px-6 py-4">{pass.student_name} ({pass.room_no})</td>
                <td className="px-6 py-4">{pass.reason}</td>
                <td className="px-6 py-4">{new Date(pass.departure_time).toLocaleString()}</td>
                <td className="px-6 py-4">{new Date(pass.expected_return_time).toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={pass.status} /></td>
                <td className="px-6 py-4">
                  {pass.status === 'Pending' && (
                    <div className="flex space-x-2">
                      <button onClick={() => handleUpdate(pass.id, 'Approved')} className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600">Approve</button>
                      <button onClick={() => handleUpdate(pass.id, 'Rejected')} className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOutpassPage;