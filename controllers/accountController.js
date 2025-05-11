// controllers/accountController.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * GET /account
 * User account page
 */
exports.getAccount = async (req, res) => {
  try {
    // Change findById to findByPk for Sequelize
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/');
    }
    
    res.render('account', {
      title: 'Your Account - DaySave.app',
      user: user,
      error: req.flash('error'),
      success: req.flash('success'),
      status: 200  // Add status to fix the error template issue
    });
  } catch (error) {
    console.error('Account page error:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load account page',
      error: req.app.get('env') === 'development' ? error : {},
      status: 500  // Add status explicitly
    });
  }
};

/**
 * POST /account/profile
 * Update profile information
 */
exports.updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/account');
    }
    
    const { name, email } = req.body;
    
    // Find the user using Sequelize
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/account');
    }
    
    // Check if email is already in use by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({
        where: { email: email.toLowerCase() }
      });
      
      if (existingUser && existingUser.id !== user.id) {
        req.flash('error', 'Email is already in use');
        return res.redirect('/account');
      }
    }
    
    // Update user
    await user.update({
      name,
      email: email.toLowerCase()
    });
    
    req.flash('success', 'Profile updated successfully');
    res.redirect('/account');
    
  } catch (error) {
    console.error('Profile update error:', error);
    req.flash('error', 'Failed to update profile');
    res.redirect('/account');
  }
};

/**
 * POST /account/password
 * Update password
 */
exports.updatePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      req.flash('error', errors.array()[0].msg);
      return res.redirect('/account');
    }
    
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match');
      return res.redirect('/account');
    }
    
    // Find the user using Sequelize
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/account');
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect');
      return res.redirect('/account');
    }
    
    // Update password
    await user.update({ password: newPassword });
    
    req.flash('success', 'Password updated successfully');
    res.redirect('/account');
    
  } catch (error) {
    console.error('Password update error:', error);
    req.flash('error', 'Failed to update password');
    res.redirect('/account');
  }
};

/**
 * POST /account/delete
 * Delete account
 */
exports.deleteAccount = async (req, res) => {
  try {
    // Find and delete the user using Sequelize
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/account');
    }
    
    // Delete the user
    await user.destroy();
    
    // Log the user out
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/');
    });
    
  } catch (error) {
    console.error('Account deletion error:', error);
    req.flash('error', 'Failed to delete account');
    res.redirect('/account');
  }
};