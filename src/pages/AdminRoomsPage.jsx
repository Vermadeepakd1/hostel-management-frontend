// src/pages/AdminRoomsPage.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import RoomForm from '../components/RoomForm';
import { getRooms, addRoom } from '../api/apiService';
import { FiPlus, FiPrinter } from 'react-icons/fi'; // 1. Import the FiPrinter icon

const INITIAL_ROOM_STATE = { room_number: '', capacity: '' };

function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(INITIAL_ROOM_STATE);

  // 2. This function opens the dedicated print page in a new tab
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
  
  const getStatus = (room) => {
    if (room.current_occupancy === 0) return <span className="text-green-600 font-semibold">Empty</span>;
    if (room.current_occupancy >= room.capacity) return <span className="text-red-600 font-semibold">Full</span>;
    return <span className="text-yellow-600 font-semibold">Partially Filled</span>;
  };

  if (isLoading) return <p>Loading rooms...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Rooms</h1>
        {/* 3. Add the Print button next to the Add Room button */}
        <div className="flex space-x-2">
          <button onClick={handlePrint} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
            <FiPrinter /><span>Print List</span>
          </button>
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
            <FiPlus /><span>Add Room</span>
          </button>
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
              {rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{room.room_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{room.capacity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{room.current_occupancy}</td>
                  <td className="px-6 py-4 text-sm">{getStatus(room)}</td>
                </tr>
              ))}
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
    </div>
  );
}

export default AdminRoomsPage;