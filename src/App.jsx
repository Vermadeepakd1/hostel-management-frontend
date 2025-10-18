// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import AdminRoomsPage from './pages/AdminRoomsPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage'; // Import the new page
import AdminFeePage from './pages/AdminFeePage';
import StudentLayout from './components/StudentLayout';
import StudentDashboardPage from './pages/StudentDashboardPage';
import StudentComplaintsPage from './pages/StudentComplaintsPage';
import StudentFeesPage from './pages/StudentFeesPage';
import StudentProfilePage from './pages/StudentProfilePage';
import AdminAnnouncementsPage from './pages/AdminAnnouncementsPage';
import StudentAnnouncementsPage from './pages/StudentAnnouncementsPage';
import StudentMessMenuPage from './pages/StudentMessMenuPage'; // menu
import AdminOutpassPage from './pages/AdminOutpassPage';
import StudentOutpassPage from './pages/StudentOutpassPage';
// Placeholders for pages we will build
// const StudentFeesPage = () => <div>My Fees Page</div>;
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
          <Route path="complaints" element={<AdminComplaintsPage />} /> 
          <Route path="fees" element={<AdminFeePage />} /> {/* Use the real component */}
          <Route path="announcements" element={<AdminAnnouncementsPage />} />
          <Route path="outpasses" element={<AdminOutpassPage />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboardPage />} />
            <Route path="dashboard" element={<StudentDashboardPage />} />
            <Route path="fees" element={<StudentFeesPage />} />
            <Route path="complaints" element={<StudentComplaintsPage />} />
             <Route path="profile" element={<StudentProfilePage />} />
             <Route path="announcements" element={<StudentAnnouncementsPage />} />
             <Route path="menu" element={<StudentMessMenuPage />} />
             <Route path="outpass" element={<StudentOutpassPage />}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;