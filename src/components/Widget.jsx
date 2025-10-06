// src/components/Widget.jsx

import React from 'react';

function Widget({ icon, title, children, color }) {
  // Define color classes for the icon background
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-start justify-between">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {/* Icon */}
        <div className={`p-2 rounded-lg ${colorClasses[color] || 'bg-gray-100'}`}>
          {icon}
        </div>
      </div>
      {/* Content */}
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
}

export default Widget;