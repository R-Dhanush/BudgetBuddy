const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  setBudget,
  getCurrentBudget,
  updateBudget
} = require('../controllers/budgetController');

const router = express.Router();

router.route('/')
  .post(protect, setBudget);

router.route('/current')
  .get(protect, getCurrentBudget);

router.route('/:id')
  .put(protect, updateBudget);

module.exports = router;