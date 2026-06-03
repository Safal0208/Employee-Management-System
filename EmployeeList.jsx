import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    api.get('/employees')
      .then((res) => setEmployees(res.data))
      .catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (err) {
      alert('Failed to delete employee.');
    }
  };

  return (
    <div className="table-container">
      <h2>Employee List</h2>
      <Link to="/employees/create" className="btn" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        + Add Employee
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No employees found.</td></tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.designation || '—'}</td>
                <td>{emp.department_name}</td>
                <td>{emp.phone || '—'}</td>
                <td>{emp.salary ? `$${emp.salary}` : '—'}</td>
                <td>
                  <div className="action-btns">
                    <Link to={`/employees/edit/${emp.id}`} className="btn">Edit</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}