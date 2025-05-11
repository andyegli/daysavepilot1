// routes/account.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { isAuthenticated } = require('../middlewares/auth');

// All routes in this file require authentication
router.use(isAuthenticated);

// Account management routes
router.get('/', accountController.getAccount);
router.post('/profile', accountController.updateProfile);
router.post('/password', accountController.updatePassword);
router.post('/preferences', accountController.updatePreferences);
router.post('/notifications', accountController.updateNotifications);
router.post('/security', accountController.updateSecurity);

// Connected accounts
router.get('/connected-accounts', accountController.getConnectedAccounts);
router.post('/connect/:provider', accountController.connectAccount);
router.post('/disconnect/:provider', accountController.disconnectAccount);

module.exports = router;
