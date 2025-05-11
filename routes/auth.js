// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth');

// Public auth routes (only accessible when not logged in)
router.get('/login', isNotAuthenticated, authController.getLogin);
router.post('/login', isNotAuthenticated, authController.postLogin);
router.get('/register', isNotAuthenticated, authController.getRegister);
router.post('/register', isNotAuthenticated, authController.postRegister);
router.get('/forgot-password', isNotAuthenticated, authController.getForgotPassword);
router.post('/forgot-password', isNotAuthenticated, authController.postForgotPassword);
router.get('/reset-password/:token', isNotAuthenticated, authController.getResetPassword);
router.post('/reset-password/:token', isNotAuthenticated, authController.postResetPassword);

// Auth routes for logged in users
router.get('/logout', isAuthenticated, authController.logout);

// Social authentication routes
router.get('/auth/facebook', authController.facebookAuth);
router.get('/auth/facebook/callback', authController.facebookAuthCallback);
router.get('/auth/google', authController.googleAuth);
router.get('/auth/google/callback', authController.googleAuthCallback);
router.get('/auth/twitter', authController.twitterAuth);
router.get('/auth/twitter/callback', authController.twitterAuthCallback);
router.get('/auth/apple', authController.appleAuth);
router.get('/auth/apple/callback', authController.appleAuthCallback);

module.exports = router;