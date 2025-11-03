// src/pages/AdminRoomsPage.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import RoomForm from '../components/RoomForm';

// --- NEW --- (Import the new API function)
import { getRooms, addRoom, uploadRoomsCSV } from '../api/apiService';
// --- END NEW ---

import { motion } from 'framer-motion';

// --- NEW --- (Import the Upload icon)
import { FiPlus, FiPrinter, FiSearch, FiUpload } from 'react-icons/fi';
// --- END NEW ---

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
  const [searchTerm, setSearchTerm] = useState('');

  // --- NEW --- (State for the upload modal and file)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  // --- END NEW ---

  const handlePrint = () => {
    window.open('/admin/rooms/print', '_blank');
  };

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to fetch rooms. Please log in again.');
    } finally {
      setIsLoading(false);
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

  // --- NEW --- (Handler functions for CSV Upload)
  
  // Opens the upload modal and resets state
  const openUploadModal = () => {
    setSelectedFile(null);
    setUploadError(null);
    setUploadSuccess(null);
    setIsUploadModalOpen(true);
  };

  // Updates state when a file is selected
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadError(null); // Clear previous errors
    setUploadSuccess(null); // Clear previous success
  };

  // Handles the file submission
  const handleCsvUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file first.");
      return;
    }

    try {
      const response = await uploadRoomsCSV(selectedFile);
      setUploadSuccess(response.message); // Show success message
      setUploadError(null);
      setSelectedFile(null); // Clear file input
      setIsUploadModalOpen(false); // Close modal on success
      fetchRooms(); // Refresh the room list
      
      // Optionally alert user
      alert(response.message); 

    } catch (err) {
      // The error 'err' is the data from the backend (e.g., { message: "Invalid CSV" })
      console.error("Upload failed:", err);
      setUploadError(err.message || "An unknown error occurred.");
      setUploadSuccess(null);
    }
  };
  // --- END NEW ---

  // --- (Helper functions for status, no changes) ---
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
  // --- (End helper functions) ---

  const filteredRooms = rooms
    .filter(room => {
      if (filterStatus === 'All') return true;
      return getRoomStatusString(room) === filterStatus;
    })
    .filter(room => {
      return room.room_number.toLowerCase().includes(searchTerm.toLowerCase());
    });

  if (isLoading) return <RoomTableSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manage Rooms</h1>
        
        {/* --- MODIFIED --- (Added Upload CSV Button) */}
        <div className="flex space-x-2">
          <button 
            onClick={handlePrint} 
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-300"
          >
            <FiPrinter /><span>Print List</span>
          </button>
          
          {/* --- NEW --- (Upload CSV Button) */}
          <button 
            onClick={openUploadModal} 
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-300"
          >
            <FiUpload /><span>Upload CSV</span>
          </button>
          {/* --- END NEW --- */}
          
          <button 
            onClick={openAddModal} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-all duration-300"
          >
            <FiPlus /><span>Add Room</span>
          </button>
        </div>
        {/* --- END MODIFIED --- */}
        
      </div>

      {/* --- (Filters and Search Bar, no changes) --- */}
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
      {/* --- (End Filters and Search Bar) --- */}


      {error && <div className="bg-red-100 p-3 rounded-md text-red-700">{error}</div>}
      
      {/* --- (Table, no changes) --- */}
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
      {/* --- (End Table) --- */}
      
      {/* --- (Add/Edit Modal, no changes) --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Room">
        <RoomForm
          room={selectedRoom}
          setRoom={setSelectedRoom}
          onSave={handleSaveRoom}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* --- NEW --- (Modal for CSV Upload) */}
      <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Rooms CSV">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select a .csv file to upload. Make sure it has the required headers: <br />
            <code className="text-xs bg-gray-100 p-1 rounded">room_number, capacity</code>
          </p>
          
          {/* File Input */}
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          
          {/* Display Error/Success Messages */}
          {uploadError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {uploadError}
            </div>
          )}
          {uploadSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {uploadSuccess}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleCsvUpload}
              disabled={!selectedFile} // Disable button if no file is selected
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload File
            </button>
          </div>
        </div>
      </Modal>
      {/* --- END NEW --- */}

    </motion.div>
  );
}

export default AdminRoomsPage;