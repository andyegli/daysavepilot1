// routes/api.js
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { isAuthenticated } = require('../middlewares/auth');

// All API routes require authentication
router.use(isAuthenticated);

// Saved Items API
router.get('/items', apiController.getSavedItems);
router.post('/items', apiController.createSavedItem);
router.get('/items/:id', apiController.getSavedItem);
router.put('/items/:id', apiController.updateSavedItem);
router.delete('/items/:id', apiController.deleteSavedItem);

// Tags API
router.get('/tags', apiController.getTags);
router.post('/tags', apiController.createTag);
router.put('/tags/:id', apiController.updateTag);
router.delete('/tags/:id', apiController.deleteTag);

// Stats API
router.get('/stats', apiController.getStats);

module.exports = router;