const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  exportTransactions // Add this import
} = require('../controllers/transactionController');

const router = express.Router();

router.route('/')
  .get(protect, getTransactions)
  .post(protect, addTransaction);

router.route('/:id')
  .put(protect, updateTransaction)
  .delete(protect, deleteTransaction);

router.route('/export')
  .get(protect, exportTransactions);

module.exports = router;