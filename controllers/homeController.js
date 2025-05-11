// controllers/homeController.js
const { Url, Tag, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Display the homepage
 */
exports.index = (req, res) => {
  res.render('index', {
    title: 'DaySave.app - Save Your Social Knowledge',
    user: req.user
  });
};

/**
 * Display the privacy policy page
 */
exports.privacy = (req, res) => {
  res.render('privacy', {
    title: 'Privacy Policy - DaySave.app',
    user: req.user
  });
};

/**
 * Display the terms of service page
 */
exports.terms = (req, res) => {
  res.render('terms', {
    title: 'Terms of Service - DaySave.app',
    user: req.user
  });
};

/**
 * Display the user dashboard
 */
exports.dashboard = async (req, res) => {
  try {
    // Fetch user's saved URLs
    const urls = await Url.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Tag }],
      order: [['created_at', 'DESC']]
    });
    
    res.render('dashboard', {
      title: 'Your Dashboard - DaySave.app',
      user: req.user,
      urls
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to load dashboard', 
      error: req.app.get('env') === 'development' ? error : {},
      status: 500
    });
  }
};