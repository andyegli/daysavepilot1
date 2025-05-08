// routes/submit.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

// Login landing page (if needed)
router.get('/login', (req, res) => {
  res.render('login');
});

// Form page
router.get('/submit', isAuthenticated, (req, res) => {
  res.render('submit');
});

// Handle form POST
router.post('/submit', isAuthenticated, async (req, res) => {
  const { url, tags, comment } = req.body;
  const userId = req.user.id;
  const localTime = new Date();
  const latitude = null; // could populate from client or IP
  const longitude = null;

  const result = await db.query(
    'INSERT INTO urls (user_id, url, local_time, latitude, longitude) VALUES (?, ?, ?, ?, ?)',
    [userId, url, localTime, latitude, longitude]
  );
  const urlId = result.insertId;

  if (tags) {
    const tagList = tags.split(',').map(tag => tag.trim());
    for (const tag of tagList) {
      await db.query('INSERT INTO tags (url_id, tag) VALUES (?, ?)', [urlId, tag]);
    }
  }

  if (comment) {
    await db.query('INSERT INTO comments (url_id, user_id, comment) VALUES (?, ?, ?)', [urlId, userId, comment]);
  }

  res.redirect('/submit');
});

module.exports = router;