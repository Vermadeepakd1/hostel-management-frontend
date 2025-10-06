// src/api/apiService.js

import axios from 'axios';

// --- Axios Default Configuration ---
// This ensures that every request sent by axios will include credentials (the cookie).
// axios.defaults.baseURL = 'https://hostel-management-system-backend-nrr2.onrender.com';
// axios.defaults.withCredentials = true;

axios.defaults.baseURL = '/api'; 
axios.defaults.withCredentials = true;
// --- AUTH FUNCTIONS ---
export const loginAdmin = async (username, password) => {
  // No need to pass the URL or config anymore, it's set by default
  const response = await axios.post('/admin/login', { username, password });
  return response.data;
};

export const loginStudent = async (rollNumber, password) => {
  const response = await axios.post('/auth/student/login', { rollNumber, password });
  return response.data;
};


// --- STUDENT CRUD FUNCTIONS ---
export const getStudents = async () => {
  const response = await axios.get('/students');
  return response.data;
};

export const addStudent = async (studentData) => {
  const response = await axios.post('/students/add', studentData);
  return response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await axios.put(`/students/update/${id}`, studentData);
  return response.data;
};

export const deleteStudent = async (id) => {
  const response = await axios.delete(`/students/delete/${id}`);
  return response.data;
};


// --- OTHER DATA FUNCTIONS ---
export const getRooms = async () => {
  const response = await axios.get('/rooms');
  return response.data;
};
// Add this logout function to your existing apiService.js file

export const logoutAdmin = async () => {
  // We don't have a dedicated logout endpoint, so we'll just return a success message
  // In a real app with server-side sessions, you would call a '/admin/logout' endpoint here.
  return Promise.resolve({ message: "Logout successful" });
};

// Add these new functions to your existing apiService.js

// --- COMPLAINT MANAGEMENT FUNCTIONS ---
export const getComplaints = async () => {
  const response = await axios.get('/complaints');
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await axios.put(`/complaints/update/${id}`, { status });
  return response.data;
};