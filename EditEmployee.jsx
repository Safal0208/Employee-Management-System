import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function EditEmployee() {
  const { id } = useParams();
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
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptRes, skillRes, empRes] = await Promise.all([
          api.get('/departments'),
          api.get('/skills'),
          api.get(`/employees/${id}`),
        ]);
        setDepartments(deptRes.data);
        setSkills(skillRes.data);
        const emp = empRes.data;
        setForm({
          department_id: emp.department_id?.toString() || '',
          phone: emp.phone || '',
          address: emp.address || '',
          designation: emp.designation || '',
          salary: emp.salary?.toString() || '',
          skill_ids: emp.skills ? emp.skills.map((s) => s.id) : [],
        });
      } catch (err) {
        setError('Failed to load employee data.');
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.put(`/employees/${id}`, {
        department_id: parseInt(form.department_id),
        phone: form.phone,
        address: form.address,
        designation: form.designation,
        salary: form.salary ? parseFloat(form.salary) : null,
        skill_ids: form.skill_ids,
      });
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee.');
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Employee</h2>
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

        <button type="submit" className="btn">Update Employee</button>
      </form>
    </div>
  );
}