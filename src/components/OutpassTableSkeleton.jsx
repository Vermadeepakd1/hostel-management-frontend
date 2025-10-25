// src/components/OutpassTableSkeleton.jsx

import React from 'react';

const OutpassTableSkeleton = () => {
  return (
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
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </td>
              <td className="px-6 py-4">
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OutpassTableSkeleton;