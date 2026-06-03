const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/departments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM departments ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching departments:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/departments
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { department_name } = req.body;

    if (!department_name) {
      return res.status(400).json({ error: 'Department name is required.' });
    }

    const result = await pool.query(
      'INSERT INTO departments (department_name) VALUES ($1) RETURNING *',
      [department_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating department:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;