// routes/index.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { isAuthenticated } = require('../middlewares/auth');

// Public routes
router.get('/', homeController.index);
// The error is likely in one of these routes. Let's check each one:
router.get('/privacy', homeController.privacy); // Check if this exists
router.get('/terms', homeController.terms);     // Check if this exists

// Protected routes
router.get('/dashboard', isAuthenticated, homeController.dashboard);

module.exports = router;



