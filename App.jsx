import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import CreateEmployee from './pages/CreateEmployee';
import EditEmployee from './pages/EditEmployee';
import DepartmentMaster from './pages/DepartmentMaster';
import SkillsMaster from './pages/SkillsMaster';
import Profile from './pages/Profile';

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><EmployeeList /></ProtectedRoute>} />
          <Route path="/employees/create" element={<ProtectedRoute><CreateEmployee /></ProtectedRoute>} />
          <Route path="/employees/edit/:id" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
          <Route path="/departments" element={<ProtectedRoute><DepartmentMaster /></ProtectedRoute>} />
          <Route path="/skills" element={<ProtectedRoute><SkillsMaster /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}