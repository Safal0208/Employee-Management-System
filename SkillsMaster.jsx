import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function SkillsMaster() {
  const [skills, setSkills] = useState([]);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/skills').then((res) => setSkills(res.data)).catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await api.post('/skills', { skill_name: newName });
      setSkills([...skills, res.data]);
      setNewName('');
    } catch (err) {
      setError('Failed to add skill.');
    }
  };

  return (
    <div className="table-container">
      <h2>Skills Master</h2>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter skill name"
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" className="btn">Add Skill</button>
      </form>
      <table>
        <thead>
          <tr><th>ID</th><th>Skill Name</th></tr>
        </thead>
        <tbody>
          {skills.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.skill_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}