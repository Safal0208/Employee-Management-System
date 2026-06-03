import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CreateEmployee() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    department_id: '',
    phone: '',
    address: '',
    designation: '',
    salary: '',
    skill_ids: [],
  });
  const [files, setFiles] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/departments').then((res) => setDepartments(res.data)).catch(() => {});
    api.get('/skills').then((res) => setSkills(res.data)).catch(() => {});
  }, []);

  const handleSkillToggle = (skillId) => {
    setForm((prev) => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(skillId)
        ? prev.skill_ids.filter((id) => id !== skillId)
        : [...prev.skill_ids, skillId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/employees', {
        user_id: user.id,
        department_id: parseInt(form.department_id),
        phone: form.phone,
        address: form.address,
        designation: form.designation,
        salary: form.salary ? parseFloat(form.salary) : null,
        skill_ids: form.skill_ids,
      });

      const employeeId = res.data.id;

      // Upload images if selected
      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append('employee_id', employeeId);
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
        await api.post('/employees/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create employee.');
    }
  };

  return (
    <div className="form-container">
      <h2>Create Employee Profile</h2>
      {error && <div className="error-msg">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Department</label>
          <select value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} required>
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.department_name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Designation</label>
          <input type="text" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Salary</label>
          <input type="number" step="0.01" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        </div>

        <div className="form-group">
          <label>Skills (multi-select)</label>
          <select multiple value={form.skill_ids} onChange={(e) => {
            const selected = Array.from(e.target.options)
              .filter((o) => o.selected)
              .map((o) => parseInt(o.value));
            setForm({ ...form, skill_ids: selected });
          }}>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>{s.skill_name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Upload Images (max 5 — Profile Photo, Aadhar, Resume, Certificate)</label>
          <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
        </div>

        <button type="submit" className="btn">Create Employee</button>
      </form>
    </div>
  );
}