// src/components/Modal.jsx

import React from 'react';
import { FiX } from 'react-icons/fi';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    // Added padding, transition, and animation classes to the backdrop
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300 animate-fade-in">
      {/* Added transform, transition, scale, opacity, and animation classes to the modal card */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Add keyframes for fade-in effect to index.css if not already there:
/*
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
*/


export default Modal;