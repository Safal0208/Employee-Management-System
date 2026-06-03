const express = require('express');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/skills
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching skills:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

// POST /api/skills
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { skill_name } = req.body;

    if (!skill_name) {
      return res.status(400).json({ error: 'Skill name is required.' });
    }

    const result = await pool.query(
      'INSERT INTO skills (skill_name) VALUES ($1) RETURNING *',
      [skill_name]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating skill:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;