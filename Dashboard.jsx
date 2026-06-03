import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/employees/stats/totals')
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', color: '#1a1a2e' }}>Dashboard</h1>
      <div className="card-grid">
        <div className="card">
          <h3>{stats ? stats.total_employees : '—'}</h3>
          <p>Total Employees</p>
        </div>
        <div className="card">
          <h3>{stats ? stats.total_departments : '—'}</h3>
          <p>Total Departments</p>
        </div>
        <div className="card">
          <h3>{stats ? stats.total_skills : '—'}</h3>
          <p>Total Skills</p>
        </div>
        <div className="card">
          <h3>{stats ? stats.total_images : '—'}</h3>
          <p>Total Uploaded Images</p>
        </div>
      </div>
    </div>
  );
}