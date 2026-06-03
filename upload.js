const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// POST /api/employees/upload  — upload up to 5 images
router.post('/', authenticateToken, upload.array('images', 5), async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'Employee ID is required.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const savedImages = [];

    for (const file of req.files) {
      const imageUrl = `/uploads/${file.filename}`;
      const result = await pool.query(
        'INSERT INTO employee_images (employee_id, image_url) VALUES ($1, $2) RETURNING *',
        [employee_id, imageUrl]
      );
      savedImages.push(result.rows[0]);
    }

    res.status(201).json({
      message: `${savedImages.length} image(s) uploaded successfully.`,
      images: savedImages,
    });
  } catch (err) {
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;