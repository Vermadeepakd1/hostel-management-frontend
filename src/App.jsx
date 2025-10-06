// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
// import AdminProfilePage from './pages/AdminProfilePage';
import AdminLayout from './components/AdminLayout'; // Corrected path

// We can create placeholder pages for the other links
const AdminRoomsPage = () => <div>Rooms Page</div>;
const AdminComplaintsPage = () => <div>Complaints Page</div>;
const StudentDashboardPage = () => <div>Student Dashboard</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Admin Routes Grouped Under AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          {/* <Route path="profile" element={<AdminProfilePage />} /> */}
          <Route path="rooms" element={<AdminRoomsPage />} />
          <Route path="complaints" element={<AdminComplaintsPage />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;