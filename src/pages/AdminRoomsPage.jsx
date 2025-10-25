// src/pages/AdminRoomsPage.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import RoomForm from '../components/RoomForm';
import { getRooms, addRoom } from '../api/apiService';
// 1. Import motion for animations and new icons
import { motion } from 'framer-motion';
import { FiPlus, FiPrinter, FiSearch } from 'react-icons/fi';
// 2. Import the new skeleton loader
import RoomTableSkeleton from '../components/RoomTableSkeleton';

const INITIAL_ROOM_STATE = { room_number: '', capacity: '' };
const filterOptions = ['All', 'Empty', 'Partially Filled', 'Full'];

function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(INITIAL_ROOM_STATE);
  const [filterStatus, setFilterStatus] = useState('All');
  // 3. Add state for the search term
  const [searchTerm, setSearchTerm] = useState('');

  const handlePrint = () => {
    window.open('/admin/rooms/print', '_blank');
  };

  const fetchRooms = async () => {
    try {
      setIsLoading(true); // Set loading true at the start
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to fetch rooms. Please log in again.');
    } finally {
      setIsLoading(false); // Set loading false at the end
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openAddModal = () => {
    setSelectedRoom(INITIAL_ROOM_STATE);
    setIsModalOpen(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      await addRoom(selectedRoom);
      setIsModalOpen(false);
      fetchRooms(); // Refresh the list
    } catch (err) {
      console.error("Failed to save room:", err);
    }
  };
  
  const getRoomStatusString = (room) => {
    if (room.current_occupancy === 0) return 'Empty';
    if (room.current_occupancy >= room.capacity) return 'Full';
    return 'Partially Filled';
  };

  const getStatus = (room) => {
    const status = getRoomStatusString(room);
    if (status === 'Empty') return <span className="text-green-600 font-semibold">Empty</span>;
    if (status === 'Full') return <span className="text-red-600 font-semibold">Full</span>;
    return <span className="text-yellow-600 font-semibold">Partially Filled</span>;
  };

  // 4. Update filteredRooms logic to include search
  const filteredRooms = rooms
    .filter(room => {
      // First, filter by status
      if (filterStatus === 'All') return true;
      return getRoomStatusString(room) === filterStatus;
    })
    .filter(room => {
      // Then, filter by search term (on room_number)
      return room.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    });

  // 5. Use the Skeleton Loader when isLoading is true
  if (isLoading) return <RoomTableSkeleton />;

  return (
    // 6. Add page-level animation
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Rooms</h1>
        {/* 7. Add smooth transitions to buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={handlePrint} 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-300"
          >
            <FiPrinter /><span>Print List</span>
          </button>
          <button 
            onClick={openAddModal} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-300"
          >
            <FiPlus /><span>Add Room</span>
          </button>
        </div>
      </div>

      {/* 8. New UI block for Filters and Search Bar */}
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
            placeholder="Search by room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {error && <div className="bg-red-100 p-3 rounded-md text-red-700">{error}</div>}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Occupancy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                // 9. Add animation and smooth hover to table rows
                <motion.tr
                  key={room.id}
                  className="hover:bg-gray-50 transition-all duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{room.room_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{room.capacity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{room.current_occupancy}</td>
                  <td className="px-6 py-4 text-sm">{getStatus(room)}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  {searchTerm ? `No rooms found for "${searchTerm}"` : `No rooms match the filter "${filterStatus}"`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Room">
        <RoomForm
          room={selectedRoom}
          setRoom={setSelectedRoom}
          onSave={handleSaveRoom}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </motion.div>
  );
}

export default AdminRoomsPage;