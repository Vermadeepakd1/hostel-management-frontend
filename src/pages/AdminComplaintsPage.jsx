// src/pages/AdminComplaintsPage.jsx

import React, { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus } from '../api/apiService';
import { FiRefreshCw } from 'react-icons/fi';

function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const data = await getComplaints();
      setComplaints(data);
    } catch (err) {
      setError('Failed to fetch complaints. Please log in again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
        await updateComplaintStatus(id, newStatus);
        // Update the status locally for an instant UI update
        setComplaints(prevComplaints =>
            prevComplaints.map(c => c.id === id ? { ...c, status: newStatus } : c)
        );
    } catch (err) {
        console.error("Failed to update status:", err);
        // Optionally, show an error message
    }
  };
  
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100'}`}>{status}</span>;
  };

  if (isLoading) return <p>Loading complaints...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Complaints</h1>
        <button onClick={fetchComplaints} className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
          <FiRefreshCw size={20} />
        </button>
      </div>
      {error && <div className="bg-red-100 p-3 rounded-md text-red-700">{error}</div>}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complaint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Change Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{complaint.student_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{complaint.room_no}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-sm whitespace-normal">{complaint.description}</td>
                  <td className="px-6 py-4 text-sm"><StatusBadge status={complaint.status} /></td>
                  <td className="px-6 py-4 text-sm">
                    <select 
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                      value={complaint.status}
                      className="p-1 border rounded-md bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminComplaintsPage;