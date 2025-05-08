const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Existing routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Add this new route for testing authentication
router.get('/check-auth', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user
  });
});

// Profile routes
router.get('/me', protect, authController.getMe);
router.put('/update', protect, authController.updateProfile);
router.put('/updatepassword', protect, authController.updatePassword);

module.exports = router;