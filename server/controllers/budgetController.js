const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

// @desc    Set monthly budget
// @route   POST /api/v1/budgets
// @access  Private
exports.setBudget = async (req, res, next) => {
  try {
    const { month, year, amount } = req.body;
    
    // Check if budget already exists for this month/year
    const existingBudget = await Budget.findOne({
      month,
      year,
      user: req.user.id
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: 'Budget already set for this month'
      });
    }

    const budget = await Budget.create({
      month,
      year,
      amount,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Get current budget status
// @route   GET /api/v1/budgets/current
// @access  Private
exports.getCurrentBudget = async (req, res, next) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1; // JavaScript months are 0-11
    const year = now.getFullYear();

    // Get budget for current month
    const budget = await Budget.findOne({
      month,
      year,
      user: req.user.id
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'No budget set for current month'
      });
    }

    // Calculate total expenses for current month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalExpenses = expenses.length > 0 ? expenses[0].total : 0;
    const remaining = budget.amount - totalExpenses;
    const percentageUsed = (totalExpenses / budget.amount) * 100;

    res.status(200).json({
      success: true,
      data: {
        budget,
        totalExpenses,
        remaining,
        percentageUsed,
        currency: '₹'
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update budget
// @route   PUT /api/v1/budgets/:id
// @access  Private
exports.updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({
        success: false,
        error: 'Budget not found'
      });
    }

    // Make sure user owns the budget
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this budget'
      });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};