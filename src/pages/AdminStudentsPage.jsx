// src/pages/AdminStudentsPage.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../api/apiService';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiPrinter } from 'react-icons/fi';

const INITIAL_STUDENT_STATE = {
  name: '', roll_no: '', email: '', phone: '', room_no: '',
  department: '', year: '', gender: '', dob: '', address: '',
  guardian_name: '', guardian_phone: ''
};

function AdminStudentsPage() {
  const [students, setStudents] = useState([]); // This is our master list
  const [filteredStudents, setFilteredStudents] = useState([]); // This is the list we display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStudent, setSelectedStudent] = useState(INITIAL_STUDENT_STATE);
  const [searchQuery, setSearchQuery] = useState(''); // State for the search input

  // This function opens the dedicated print page in a new tab
  const handlePrint = () => {
    window.open('/admin/students/print', '_blank');
  };

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await getStudents();
      setStudents(data); // Set the master list
      setFilteredStudents(data); // Initially, the filtered list is the full list
    } catch (err) {
      setError('Failed to fetch students. Please log in again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // This useEffect runs whenever the search query changes
  useEffect(() => {
    const result = students.filter(student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.roll_no.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStudents(result);
  }, [searchQuery, students]);


  const openAddModal = () => {
    setModalMode('add');
    setSelectedStudent(INITIAL_STUDENT_STATE);
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setModalMode('edit');
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleSaveStudent = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await addStudent(selectedStudent);
      } else {
        await updateStudent(selectedStudent.id, selectedStudent);
      }
      setIsModalOpen(false);
      fetchStudents(); // Re-fetch all students to get the latest data
    } catch (err) {
      console.error("Failed to save student:", err);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        fetchStudents(); // Re-fetch all students
      } catch (err) {
        console.error("Failed to delete student:", err);
      }
    }
  };

  if (isLoading) return <p>Loading students...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
        <div className="flex space-x-2">
          {/* UPDATED: "Print List" button added */}
          <button onClick={handlePrint} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
            <FiPrinter /><span>Print List</span>
          </button>
          <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
            <FiPlus /><span>Add Student</span>
          </button>
        </div>
      </div>

      {/* --- Search Bar --- */}
      <div className="mb-4 relative">
        <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or roll number..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>
      {/* -------------------- */}
      
      {error && <div className="bg-red-100 p-3 rounded-md text-red-700">{error}</div>}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* The table now correctly maps over the filteredStudents list */}
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.roll_no}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{student.room_no}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex space-x-4">
                    <button onClick={() => openEditModal(student)} className="text-blue-600 hover:text-blue-800"><FiEdit size={18} /></button>
                    <button onClick={() => handleDeleteStudent(student.id)} className="text-red-600 hover:text-red-800"><FiTrash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Add New Student' : 'Edit Student'}>
        <StudentForm
          student={selectedStudent}
          setStudent={setSelectedStudent}
          onSave={handleSaveStudent}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default AdminStudentsPage;