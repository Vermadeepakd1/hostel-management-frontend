// src/components/StudentForm.jsx

import React from 'react';

// REMOVED departmentOptions array

// Year options remain the same
const yearOptions = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
];

function StudentForm({ student, onSave, onCancel, setStudent }) {
  // General change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  // Specific handler for phone numbers to allow only digits
  const handlePhoneChange = (e) => {
     const { name, value } = e.target;
     const digitsOnly = value.replace(/\D/g, ''); // Removes non-digit characters
     setStudent(prev => ({ ...prev, [name]: digitsOnly }));
  };

  // Helper to format date for input type="date" (YYYY-MM-DD)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto p-1"> {/* Scrollable container */}
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        {/* --- Personal Details --- */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input name="name" value={student.name || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Roll Number</label>
          <input name="roll_no" value={student.roll_no || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" required disabled={!!student.id} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" value={student.email || ''} onChange={handleChange} type="email" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input name="phone" value={student.phone || ''} onChange={handlePhoneChange} type="tel" pattern="[0-9]*" title="Please enter only digits" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input name="dob" value={formatDateForInput(student.dob)} onChange={handleChange} type="date" placeholder="YYYY-MM-DD" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
           <select name="gender" value={student.gender || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
           </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea name="address" value={student.address || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" rows="2"></textarea>
        </div>

        {/* --- Academic Details --- */}
         <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Academic Details</h3>
         </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Number</label>
          <input name="room_no" value={student.room_no || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" required />
        </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          {/* 👇 UPDATED: Changed from select to input */}
          <input name="department" value={student.department || ''} onChange={handleChange} placeholder="Enter Department (e.g., CSE)" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <select name="year" value={student.year || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150">
            <option value="">Select Year</option>
            {yearOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* --- Guardian Details --- */}
        <div className="md:col-span-2 pt-4 mt-2 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Guardian Details</h3>
         </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
          <input name="guardian_name" value={student.guardian_name || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
          <input name="guardian_phone" value={student.guardian_phone || ''} onChange={handlePhoneChange} type="tel" pattern="[0-9]*" title="Please enter only digits" className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150" />
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-150">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-150">Save Student</button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;