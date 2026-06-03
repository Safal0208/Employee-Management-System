import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function DepartmentMaster() {
  const [departments, setDepartments] = useState([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/departments').then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await api.post('/departments', { department_name: newName });
      setDepartments([...departments, res.data]);
      setNewName('');
    } catch (err) {
      setError('Failed to add department.');
    }
  };

  return (
    <div className="table-container">
      <h2>Department Master</h2>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter department name"
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" className="btn">Add Department</button>
      </form>
      <table>
        <thead>
          <tr><th>ID</th><th>Department Name</th></tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.department_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}