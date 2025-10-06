// src/pages/AdminStudentsPage.jsx

import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import { getStudents, addStudent, updateStudent, deleteStudent } from '../api/apiService';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const INITIAL_STUDENT_STATE = {
  name: '', roll_no: '', email: '', phone: '', room_no: '',
  department: '', year: '', gender: '', dob: '', address: '',
  guardian_name: '', guardian_phone: ''
};

function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedStudent, setSelectedStudent] = useState(INITIAL_STUDENT_STATE);

  const fetchStudents = async () => {
    try {
    setIsLoading(true);
    const data = await getStudents();
    // console.log(data);

    setStudents(data);
     }catch (err) {
      setError('Failed to fetch students. Please log in again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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
      fetchStudents();
    } catch (err) {
      console.error("Failed to save student:", err);
      // You can set an error state here to show in the modal
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(id);
        fetchStudents();
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
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2">
          <FiPlus /><span>Add Student</span>
        </button>
      </div>
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
            {students.map((student) => (
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