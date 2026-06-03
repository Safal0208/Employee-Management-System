const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/employees  — list all with department name
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.name, d.department_name,
             ep.id, ep.user_id, ep.department_id, ep.phone,
             ep.address, ep.designation, ep.salary, ep.created_at
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id
      ORDER BY ep.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/employees/:id  — single employee with department, skills, images
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const profileResult = await pool.query(`
      SELECT ep.*, u.name, u.email, d.department_name
      FROM employee_profiles ep
      INNER JOIN users u ON ep.user_id = u.id
      INNER JOIN departments d ON ep.department_id = d.id
      WHERE ep.id = $1
    `, [id]);

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    const skillsResult = await pool.query(`
      SELECT s.id, s.skill_name
      FROM employee_skills es
      INNER JOIN skills s ON es.skill_id = s.id
      WHERE es.employee_id = $1
    `, [id]);

    const imagesResult = await pool.query(
      'SELECT * FROM employee_images WHERE employee_id = $1', [id]
    );

    res.json({
      ...profileResult.rows[0],
      skills: skillsResult.rows,
      images: imagesResult.rows,
    });
  } catch (err) {
    console.error('Error fetching employee:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/employees  — create employee with skills
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user_id, department_id, phone, address, designation, salary, skill_ids } = req.body;

    if (!user_id || !department_id) {
      return res.status(400).json({ error: 'User ID and department ID are required.' });
    }

    const profileResult = await pool.query(
      `INSERT INTO employee_profiles (user_id, department_id, phone, address, designation, salary)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, department_id, phone || null, address || null, designation || null, salary || null]
    );

    const employeeId = profileResult.rows[0].id;

    // Insert skill associations if provided
    if (skill_ids && skill_ids.length > 0) {
      for (const skill_id of skill_ids) {
        await pool.query(
          'INSERT INTO employee_skills (employee_id, skill_id) VALUES ($1, $2)',
          [employeeId, skill_id]
        );
      }
    }

    res.status(201).json(profileResult.rows[0]);
  } catch (err) {
    console.error('Error creating employee:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// PUT /api/employees/:id  — update employee
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { department_id, phone, address, designation, salary, skill_ids } = req.body;

    const result = await pool.query(
      `UPDATE employee_profiles
       SET department_id = COALESCE($1, department_id),
           phone = COALESCE($2, phone),
           address = COALESCE($3, address),
           designation = COALESCE($4, designation),
           salary = COALESCE($5, salary)
       WHERE id = $6 RETURNING *`,
      [department_id, phone, address, designation, salary, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Update skills if provided: remove all, then re-add
    if (skill_ids && skill_ids.length > 0) {
      await pool.query('DELETE FROM employee_skills WHERE employee_id = $1', [id]);
      for (const skill_id of skill_ids) {
        await pool.query(
          'INSERT INTO employee_skills (employee_id, skill_id) VALUES ($1, $2)',
          [id, skill_id]
        );
      }
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating employee:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM employee_skills WHERE employee_id = $1', [id]);
    await pool.query('DELETE FROM employee_images WHERE employee_id = $1', [id]);
    const result = await pool.query(
      'DELETE FROM employee_profiles WHERE id = $1 RETURNING id', [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json({ message: 'Employee deleted successfully.' });
  } catch (err) {
    console.error('Error deleting employee:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// GET /api/employees/stats/totals  — dashboard card counts
router.get('/stats/totals', authenticateToken, async (req, res) => {
  try {
    const empCount = await pool.query('SELECT COUNT(*) AS count FROM employee_profiles');
    const deptCount = await pool.query('SELECT COUNT(*) AS count FROM departments');
    const skillCount = await pool.query('SELECT COUNT(*) AS count FROM skills');
    const imgCount = await pool.query('SELECT COUNT(*) AS count FROM employee_images');

    res.json({
      total_employees: parseInt(empCount.rows[0].count),
      total_departments: parseInt(deptCount.rows[0].count),
      total_skills: parseInt(skillCount.rows[0].count),
      total_images: parseInt(imgCount.rows[0].count),
    });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;