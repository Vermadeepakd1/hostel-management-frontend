// src/components/StudentForm.jsx

import React from 'react';

function StudentForm({ student, onSave, onCancel, setStudent }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
  };

  return (
    // This div makes the form scrollable if the content is too long for the modal
    <div className="max-h-[70vh] overflow-y-auto p-1">
      <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        
        {/* Form Fields with Labels */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input name="name" value={student.name || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Roll Number</label>
          <input name="roll_no" value={student.roll_no || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input name="email" value={student.email || ''} onChange={handleChange} type="email" className="w-full p-2 border rounded mt-1" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input name="phone" value={student.phone || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Room Number</label>
          <input name="room_no" value={student.room_no || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input name="department" value={student.department || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <select name="year" value={student.year || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-white">
            <option value="">Select Year</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
           <select name="gender" value={student.gender || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-white">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            {/* <option value="Other">Other</option> */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input name="dob" value={student.dob || ''} onChange={handleChange} type="date" className="w-full p-2 border rounded mt-1" />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea name="address" value={student.address || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" rows="2"></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
          <input name="guardian_name" value={student.guardian_name || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Guardian Phone</label>
          <input name="guardian_phone" value={student.guardian_phone || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1" />
        </div>

        {/* Action Buttons */}
        <div className="md:col-span-2 flex justify-end space-x-3 mt-4 pt-4 border-t">
          <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Save Student</button>
        </div>
      </form>
    </div>
  );
}

export default StudentForm;