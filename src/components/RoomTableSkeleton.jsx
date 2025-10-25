// src/components/RoomTableSkeleton.jsx

import React from 'react';

// This component renders a placeholder table with 5 pulsing rows
const RoomTableSkeleton = () => {
  return (
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
          {/* Create 5 skeleton rows */}
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTableSkeleton;