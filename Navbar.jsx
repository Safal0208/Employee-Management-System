import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">Employee Management</Link>
      </div>
      {user && (
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/employees">Employee List</Link>
          <Link to="/employees/create">Add Employee</Link>
          <Link to="/departments">Departments</Link>
          <Link to="/skills">Skills</Link>
          <Link to="/profile">Profile</Link>
          <button className="btn-logout" onClick={handleLogout}>Logout ({user.name})</button>
        </div>
      )}
    </nav>
  );
}