// src/components/RoomForm.jsx

import React from 'react';

function RoomForm({ room, setRoom, onSave, onCancel }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Room Number</label>
        <input name="room_number" value={room.room_number || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Capacity</label>
        <input name="capacity" value={room.capacity || ''} onChange={handleChange} type="number" className="w-full p-2 border rounded mt-1" required />
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Save Room</button>
      </div>
    </form>
  );
}

export default RoomForm;