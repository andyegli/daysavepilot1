// controllers/authController.js
const { User } = require('../models');
const { Op } = require('sequelize'); // Add this line for Sequelize operators
const crypto = require('crypto');

const passport = require('passport');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

/**
 * GET /login
 * Login page
 */
exports.getLogin = (req, res) => {
  res.render('login', {
    title: 'DaySave.app - Login',
    error: req.flash('error')
  });
};

/**
 * POST /login
 * Process login form
 */
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message || 'Invalid credentials');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Redirect to saved URL or dashboard
      const returnTo = req.session.returnTo || '/dashboard';
      delete req.session.returnTo;
      res.redirect(returnTo);
    });
  })(req, res, next);
};

/**
 * GET /register
 * Registration page
 */
exports.getRegister = (req, res) => {
  res.render('register', {
    title: 'DaySave.app - Register',
    error: req.flash('error')
  });
};

/**
 * POST /register
 * Process registration form
 */
exports.postRegister = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/register');
    }
    
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user exists using Sequelize
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() }
    });
    
    if (existingUser) {
      req.flash('error', 'Email is already in use');
      return res.redirect('/register');
    }
    
    // Create new user with Sequelize
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email: email.toLowerCase(),
      password: password // Will be hashed by the beforeCreate hook
    });
    
    // Log the user in after registration
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/dashboard');
    });
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error', 'An error occurred during registration');
    res.redirect('/register');
  }
};

/**
 * GET /logout
 * Logout user
 */
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

/**
 * GET /forgot-password
 * Forgot password page
 */
exports.getForgotPassword = (req, res) => {
  res.render('forgot-password', {
    title: 'DaySave.app - Forgot Password',
    error: req.flash('error'),
    success: req.flash('success')
  });
};

/**
 * POST /forgot-password
 * Process forgot password form
 */
exports.postForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email with Sequelize
    const user = await User.findOne({
      where: { email: email.toLowerCase() }
    });
    
    if (!user) {
      req.flash('error', 'No account with that email address exists');
      return res.redirect('/forgot-password');
    }
    
    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');
    
    // Update user with token info
    await user.update({
      resetPasswordToken: token,
      resetPasswordExpires: new Date(Date.now() + 3600000) // 1 hour
    });
    
    // For development, just log the token
    console.log(`Password reset token for ${email}: ${token}`);
    
    // In production, you would send an email
    /* 
    const transporter = nodemailer.createTransport({
      // Configure your email provider here
    });
    
    const mailOptions = {
      to: user.email,
      from: 'password-reset@daysave.app',
      subject: 'DaySave.app Password Reset',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset-password/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    
    await transporter.sendMail(mailOptions);
    */
    
    req.flash('success', 'An email has been sent with further instructions');
    res.redirect('/forgot-password');
    
  } catch (err) {
    console.error('Forgot password error:', err);
    req.flash('error', 'An error occurred');
    res.redirect('/forgot-password');
  }
};

/**
 * GET /reset-password/:token
 * Reset password page
 */
exports.getResetPassword = async (req, res) => {
  try {
    // Find user with valid reset token using Sequelize
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: new Date() } // Using Sequelize operator
      }
    });
    
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired');
      return res.redirect('/forgot-password');
    }
    
    res.render('reset-password', {
      title: 'DaySave.app - Reset Password',
      token: req.params.token,
      error: req.flash('error')
    });
    
  } catch (err) {
    console.error('Reset password error:', err);
    req.flash('error', 'An error occurred');
    res.redirect('/forgot-password');
  }
};

/**
 * POST /reset-password/:token
 * Process reset password form
 */
exports.postResetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      req.flash('error', 'Passwords do not match');
      return res.redirect(`/reset-password/${req.params.token}`);
    }
    
    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: new Date() }
      }
    });
    
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired');
      return res.redirect('/forgot-password');
    }
    
    // Update password and clear reset token
    await user.update({
      password: password, // Will be hashed by beforeUpdate hook
      resetPasswordToken: null,
      resetPasswordExpires: null
    });
    
    // Log the user in after password reset
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Your password has been updated!');
      res.redirect('/dashboard');
    });
    
  } catch (err) {
    console.error('Reset password error:', err);
    req.flash('error', 'An error occurred');
    res.redirect('/forgot-password');
  }
};

// Social authentication placeholders
// You can implement these when you set up social authentication

exports.facebookAuth = (req, res) => {
  res.redirect('/dashboard'); // Placeholder
};

exports.facebookAuthCallback = (req, res) => {
  res.redirect('/dashboard'); // Placeholder
};

exports.googleAuth = (req, res) => {
  res.redirect('/dashboard'); // Placeholder
};

exports.googleAuthCallback = (req, res) => {
  res.redirect('/dashboard'); // Placeholder
};

exports.twitterAuth = (req, res) => {
  res.redirect('/dashboard'); // Placeholder
};

exports.twitterAuthCallback = (req, res) => {
  res.redirect('/dashboard'); // Placeholder
};

exports.appleAuth = (req, res) => {
  res.redirect('/dashboard'); // Placeholder
};

exports.appleAuthCallback = (req, res) => {
  res.redirect('/dashboard'); // Placeholder
};