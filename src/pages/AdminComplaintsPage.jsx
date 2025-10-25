// src/pages/AdminComplaintsPage.jsx

import React, { useState, useEffect } from 'react';
import { getComplaints, updateComplaintStatus } from '../api/apiService';
import { FiRefreshCw, FiSearch } from 'react-icons/fi';

// Helper component for status badges
const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100'}`}>{status}</span>;
};

function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([]); // Master list from API
  const [filteredComplaints, setFilteredComplaints] = useState([]); // List to display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // For room search
  const [statusFilter, setStatusFilter] = useState('All'); // For status buttons
  const [hideResolved, setHideResolved] = useState(false); // For checkbox

  // Fetches all complaints from the backend
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

  // Fetch complaints when the component first loads
  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter the complaints whenever the master list, search query, status filter, or hideResolved checkbox changes
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const result = complaints.filter(complaint => {
      // Check if room number matches search query
      const roomMatch = complaint.room_no?.toLowerCase().includes(query);

      // Check if status matches filter
      let statusMatch = true;
      if (statusFilter !== 'All') {
        statusMatch = complaint.status === statusFilter;
      } else if (hideResolved) {
        // Only hide resolved if 'All' filter is active and checkbox is checked
        statusMatch = complaint.status !== 'Resolved';
      }

      return roomMatch && statusMatch;
    });
    setFilteredComplaints(result);
  }, [searchQuery, statusFilter, hideResolved, complaints]);


  // Handles updating the status of a complaint via API
  const handleStatusChange = async (id, newStatus) => {
    try {
        await updateComplaintStatus(id, newStatus);
        // Update the status in the master list; the useEffect above will handle filtering
        setComplaints(prevComplaints =>
            prevComplaints.map(c => c.id === id ? { ...c, status: newStatus } : c)
        );
    } catch (err) {
        console.error("Failed to update status:", err);
        // Optionally show an error to the user here
    }
  };

  if (isLoading) return <p>Loading complaints...</p>;

  // Helper function for styling the active filter button
  const getFilterButtonClass = (status) => {
    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      statusFilter === status
        ? 'bg-blue-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Complaints</h1>
        <button onClick={fetchComplaints} className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100" title="Refresh List">
          <FiRefreshCw size={20} />
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium mr-2">Filter by Status:</span>
        <button onClick={() => setStatusFilter('All')} className={getFilterButtonClass('All')}>All</button>
        <button onClick={() => setStatusFilter('Pending')} className={getFilterButtonClass('Pending')}>Pending</button>
        <button onClick={() => setStatusFilter('In Progress')} className={getFilterButtonClass('In Progress')}>In Progress</button>
        <button onClick={() => setStatusFilter('Resolved')} className={getFilterButtonClass('Resolved')}>Resolved</button>
        {/* Hide Resolved Checkbox */}
        {statusFilter === 'All' && (
           <label className="ml-4 flex items-center space-x-2 text-sm cursor-pointer">
             <input type="checkbox" checked={hideResolved} onChange={(e) => setHideResolved(e.target.checked)} className="rounded"/>
             <span>Hide Resolved</span>
           </label>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4 relative">
        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by room number..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && <div className="bg-red-100 p-3 rounded-md text-red-700 border border-red-300">{error}</div>}

      {/* Complaints Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200">
           <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComplaints.length > 0 ? filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{complaint.student_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{complaint.room_no}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-sm whitespace-normal">{complaint.description}</td>
                  <td className="px-6 py-4 text-sm"><StatusBadge status={complaint.status} /></td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <select
                      onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                      value={complaint.status}
                      className="p-1 border rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="text-center py-10 text-gray-500">
                        {isLoading ? 'Loading...' : 'No complaints match your filters.'}
                    </td>
                </tr>
              )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminComplaintsPage;