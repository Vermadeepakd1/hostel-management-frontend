// src/pages/PrintableRoomsPage.jsx

import React, { useState, useEffect } from 'react';
import { getRooms } from '../api/apiService';

function PrintableRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndPrint = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch rooms for printing:", error);
        setIsLoading(false);
      }
    };
    fetchAndPrint();
  }, []);

  // This runs after the data is loaded and triggers the print dialog
  useEffect(() => {
    if (!isLoading && rooms.length > 0) {
      window.print();
    }
  }, [isLoading, rooms]);

  const getStatusText = (room) => {
    if (room.current_occupancy === 0) return 'Empty';
    if (room.current_occupancy >= room.capacity) return 'Full';
    return 'Partially Filled';
  };

  if (isLoading) return <p>Preparing document for printing...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-2">Hostel Room List</h1>
      <p className="text-sm text-gray-500 mb-6">Generated on: {new Date().toLocaleString('en-IN')}</p>
      <table className="min-w-full divide-y divide-gray-300 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Room Number</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Capacity</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Occupancy</th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rooms.map((room) => (
            <tr key={room.id}>
              <td className="px-4 py-2">{room.room_number}</td>
              <td className="px-4 py-2">{room.capacity}</td>
              <td className="px-4 py-2">{room.current_occupancy}</td>
              <td className="px-4 py-2">{getStatusText(room)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PrintableRoomsPage;