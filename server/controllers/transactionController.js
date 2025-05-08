const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    // Filtering
    let query = { user: req.user.id };
    
    // Date filtering
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    // Type filtering
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    // Category filtering
    if (req.query.category) {
      query.category = req.query.category;
    }

    const transactions = await Transaction.find(query).sort('-date');
    
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Add transaction
// @route   POST /api/v1/transactions
// @access  Private
exports.addTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date } = req.body;
    
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Update transaction
// @route   PUT /api/v1/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Make sure user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this transaction'
      });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Make sure user owns the transaction
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this transaction'
      });
    }

    await transaction.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc    Export transactions
// @route   GET /api/v1/transactions/export
// @access  Private
exports.exportTransactions = async (req, res, next) => {
  try {
    const { format = 'json' } = req.query;
    
    // Apply same filters as getTransactions
    let query = { user: req.user.id };
    
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    const transactions = await Transaction.find(query).sort('-date');

    if (format === 'csv') {
      // Convert to CSV
      let csv = 'Date,Title,Category,Type,Amount(₹)\n';
      
      transactions.forEach(transaction => {
        csv += `"${new Date(transaction.date).toLocaleDateString('en-IN')}",`;
        csv += `"${transaction.title}",`;
        csv += `"${transaction.category}",`;
        csv += `"${transaction.type}",`;
        csv += `"${transaction.amount.toFixed(2)}"\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
      return res.send(csv);
    } else {
      // Default to JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=transactions.json');
      return res.send(transactions);
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};