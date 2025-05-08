const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get dashboard overview
// @route   GET /api/v1/dashboard
// @access  Private
exports.getDashboardData = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Date ranges
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0);
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // Total balances
    const incomeAgg = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'income'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const expenseAgg = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const totalIncome = incomeAgg.length > 0 ? incomeAgg[0].total : 0;
    const totalExpenses = expenseAgg.length > 0 ? expenseAgg[0].total : 0;
    const balance = totalIncome - totalExpenses;

    // Monthly summary
    const monthlyIncome = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'income',
          date: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Top categories
    const topCategories = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: monthStart, $lte: monthEnd }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ]);

    // Weekly trends
    const weeklyTrends = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: weekStart, $lte: weekEnd }
        }
      },
      {
        $group: {
          _id: {
            day: { $dayOfWeek: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ]);

    // Budget status
    const budget = await Budget.findOne({
      month: currentMonth,
      year: currentYear,
      user: req.user.id
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalIncome,
          totalExpenses,
          balance,
          currency: '₹'
        },
        monthly: {
          income: monthlyIncome.length > 0 ? monthlyIncome[0].total : 0,
          expenses: monthlyExpenses.length > 0 ? monthlyExpenses[0].total : 0,
          budget: budget?.amount || 0
        },
        topCategories,
        weeklyTrends,
        monthlyTrends
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};