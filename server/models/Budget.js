const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: '₹',
    enum: ['₹']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one budget per user per month
budgetSchema.index({ month: 1, year: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);