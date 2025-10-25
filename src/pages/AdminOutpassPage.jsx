// src/pages/AdminOutpassPage.jsx

import React, { useState, useEffect } from 'react';
import { getAllOutpasses, updateOutpassStatus } from '../api/apiService';
// 1. Import motion, new icon, and skeleton loader
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import OutpassTableSkeleton from '../components/OutpassTableSkeleton';

// 2. Define filter options
const filterOptions = ['Pending', 'Approved', 'Rejected', 'All'];

function AdminOutpassPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // 3. Add state for filter and search
  const [filterStatus, setFilterStatus] = useState('Pending'); // Default to 'Pending' as requested
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRequests = async () => {
    setIsLoading(true);
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
    } catch (error){
      console.error(`Failed to ${status} request:`, error);
    }
  };

  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
  };

  // 4. Create the filtered list based on state
  const filteredRequests = requests.filter(pass => {
    const search = searchTerm.toLowerCase();
    // Search by student name OR room number
    const searchMatch = (
      pass.student_name.toLowerCase().includes(search) ||
      pass.room_no.toLowerCase().includes(search)
    );
    
    // Filter by status
    const statusMatch = (filterStatus === 'All' || pass.status === filterStatus);

    return searchMatch && statusMatch;
  });

  // 5. Use the skeleton loader
  if (isLoading) return <OutpassTableSkeleton />;

  return (
    // 6. Add page animation
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Out Pass Requests</h1>
      
      {/* 7. New UI block for Filters and Search Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        {/* Filter Buttons */}
        <div className="flex space-x-2 flex-wrap">
          {filterOptions.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

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
            {/* 8. Map over filteredRequests and add animation */}
            {filteredRequests.length > 0 ? filteredRequests.map(pass => (
              <motion.tr 
                key={pass.id}
                className="hover:bg-gray-50 transition-all duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 text-sm text-gray-900">{pass.student_name} ({pass.room_no})</td>
                <td className="px-6 py-4 text-sm text-gray-500">{pass.reason}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(pass.departure_time).toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(pass.expected_return_time).toLocaleString()}</td>
                <td className="px-6 py-4"><StatusBadge status={pass.status} /></td>
                <td className="px-6 py-4">
                  {pass.status === 'Pending' && (
                    <div className="flex space-x-2">
                      {/* 9. Add hover/transition to buttons */}
                      <button 
                        onClick={() => handleUpdate(pass.id, 'Approved')} 
                        className="bg-green-500 text-white px-3 py-1 text-xs font-medium rounded-md hover:bg-green-600 transition-all duration-300"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleUpdate(pass.id, 'Rejected')} 
                        className="bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-md hover:bg-red-600 transition-all duration-300"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            )) : (
              // 10. Show a message if no requests match
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  {searchTerm ? `No requests found for "${searchTerm}"` : `No ${filterStatus.toLowerCase()} requests.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default AdminOutpassPage;