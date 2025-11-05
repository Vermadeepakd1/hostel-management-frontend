import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

// --- AUTH FUNCTIONS --- check admin or student 
export const loginAdmin = async (username, password) => {
  const response = await axios.post('/admin/login', { username, password });
  return response.data;
};

export const loginStudent = async (rollNumber, password) => {
  const response = await axios.post('/auth/student/login', { roll_no: rollNumber, password });
  return response.data;
};

export const logoutAdmin = async () => {
  return Promise.resolve({ message: "Logout successful" });
};

// --- ADMIN FUNCTIONS --- all api calls

export const getAdminProfile = async () => {
  const response = await axios.get('/admin/profile');
  return response.data;
};

// --- STUDENT CRUD FUNCTIONS (FOR ADMIN) --- done by admin
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

// --- ROOM CRUD FUNCTIONS (FOR ADMIN) ---
export const getRooms = async () => {
  const response = await axios.get('/rooms');
  return response.data;
};

export const addRoom = async (roomData) => {
  const response = await axios.post('/rooms/add', roomData);
  return response.data;
};

// --- ADDED FUNCTION 1 ---
/**
 * Updates the capacity of a specific room.
 * @param {string} id - The ID of the room to update
 * @param {number} newCapacity - The new capacity number
 */
export const updateRoomCapacity = async (id, newCapacity) => {
  // The body must be { capacity: newCapacity } as per your backend spec
  const response = await axios.put(`/rooms/update/${id}`, { capacity: newCapacity });
  return response.data;
};

// --- ADDED FUNCTION 2 ---
/**
 * Deletes a specific room.
 * @param {string} id - The ID of the room to delete
 */
export const deleteRoom = async (id) => {
  const response = await axios.delete(`/rooms/delete/${id}`);
  return response.data;
};

// --- COMPLAINT MANAGEMENT FUNCTIONS (FOR ADMIN) ---
export const getComplaints = async () => {
  const response = await axios.get('/complaints');
  return response.data;
};

export const updateComplaintStatus = async (id, status) => {
  const response = await axios.put(`/complaints/update/${id}`, { status });
  return response.data;
};

// --- FEE MANAGEMENT FUNCTIONS (FOR ADMIN) ---
export const getStudentFeeHistory = async (studentId) => {
  const response = await axios.get(`/fees/student/${studentId}`);
  return response.data;
};

export const addFeePayment = async (feeData) => {
  const response = await axios.post('/fees/add', feeData);
  return response.data;
};

// --- ANNOUNCEMENT FUNCTIONS ---
export const getAnnouncements = async () => {
  const response = await axios.get('/announcements');
  return response.data;
};

export const createAnnouncement = async (title, content) => {
  const response = await axios.post('/announcements/add', { title, content });
  return response.data;
};

// All Students Api calls by Students
// --- STUDENT PORTAL FUNCTIONS --- 
export const getStudentProfile = async () => {
  const response = await axios.get('/student/profile');
  return response.data;
};

export const getStudentComplaints = async () => {
  const response = await axios.get('/student/complaint');
  return response.data;
};

export const submitStudentComplaint = async (description) => {
  const response = await axios.post('/student/complaint', { description });
  return response.data;
};

export const getStudentFees = async () => {
  const response = await axios.get('/student/fees');
  return response.data;
};

export const changeStudentPassword = async (oldPassword, newPassword) => {
  const response = await axios.post('/auth/student/change-password', { oldPassword, newPassword });
  return response.data;
};

// --- OUT PASS FUNCTIONS --- include functions of both admin and student 
export const submitOutpassRequest = async (outpassData) => {
  const response = await axios.post('/student/outpass', outpassData);
  return response.data;
};

export const getStudentOutpasses = async () => {
  const response = await axios.get('/student/outpass');
  return response.data;
};

export const getAllOutpasses = async () => {
  const response = await axios.get('/outpasses');
  return response.data;
};

export const updateOutpassStatus = async (id, status) => {
  const response = await axios.put(`/outpasses/update/${id}`, { status });
  return response.data;
};

// Add this near your other student functions (getStudents, addStudent, etc.)
/**
 * Uploads a CSV file of students to the backend.
 * @param {File} fileObject The file object from the input field.
 * @returns {Promise<any>} The response data from the server.
 */
export const uploadStudentsCSV = async (fileObject) => {
  const formData = new FormData();
  formData.append('file', fileObject); // The key 'file' must match the backend

  try {
    const response = await axios.post(
      '/students/upload', // Use relative path
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // withCredentials: true is already set globally in your file,
        // but adding it here is fine for clarity.
      }
    );
    return response.data;
  } catch (error) {
    // Re-throw the error data to be caught by the component
    throw (error.response && error.response.data) ? error.response.data : error;
  }
};

// Add this near your other room functions (getRooms, addRoom, etc.)
/**
 * Uploads a CSV file of rooms to the backend.
 * @param {File} fileObject The file object from the input field.
 ** @returns {Promise<any>} The response data from the server.
 */
export const uploadRoomsCSV = async (fileObject) => {
  const formData = new FormData();
  formData.append('file', fileObject); // The key 'file' must match the backend

  try {
    const response = await axios.post(
      '/rooms/upload', // Use relative path
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    // Re-throw the error data to be caught by the component
    throw (error.response && error.response.data) ? error.response.data : error;
  }
};