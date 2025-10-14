// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminRoomsPage from './pages/AdminRoomsPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage'; // Import the new page
import StudentLayout from './components/StudentLayout';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentComplaintsPage from './pages/StudentComplaintsPage';
// Placeholders for pages we will build
const StudentFeesPage = () => <div>My Fees Page</div>;
// const StudentComplaintsPage = () => <div>My Complaints Page</div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="rooms" element={<AdminRoomsPage />} />
          <Route path="complaints" element={<AdminComplaintsPage />} /> {/* Use the real component */}
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="fees" element={<StudentFeesPage />} />
            <Route path="complaints" element={<StudentComplaintsPage />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;