// src/components/AnnouncementSkeleton.jsx

import React from 'react';

const AnnouncementSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Skeleton for Create Form */}
      <div className="lg:col-span-1 animate-pulse">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded w-full"></div>
            <div className="h-28 bg-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>

      {/* Skeleton for Announcements List */}
      <div className="lg:col-span-2 animate-pulse">
        <div className="h-7 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="h-5 bg-gray-200 rounded w-3/5 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSkeleton;