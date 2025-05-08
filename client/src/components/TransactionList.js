import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionForm from './TransactionForm';
import ExportButton from './ExportButton';
import './TransactionList.css';

const TransactionList = () => {
  const { transactions, loading, deleteTransaction, filters, setFilters } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getCategoryLabel = (category) => {
    const categoryLabels = {
      salary: 'Salary',
      freelance: 'Freelance',
      investment: 'Investment',
      food: 'Food',
      transport: 'Transport',
      shopping: 'Shopping',
      bills: 'Bills',
      entertainment: 'Entertainment',
      health: 'Health',
      education: 'Education'
    };
    return categoryLabels[category] || category;
  };

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <h2>Your Transactions</h2>
        <div className="transaction-actions">
          <ExportButton />
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <label>Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="investment">Investment</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="shopping">Shopping</option>
            <option value="bills">Bills</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>To</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>

      {/* Transaction Form Modal */}
      {(showForm || editingTransaction) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TransactionForm
              transactionToEdit={editingTransaction}
              onCancel={() => {
                setShowForm(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Transactions List */}
      {loading ? (
        <div className="loading">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="no-transactions">No transactions found</div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                className={`transaction-row ${transaction.type}`}
              >
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.title}</td>
                <td>{getCategoryLabel(transaction.category)}</td>
                <td className={`amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </td>
                <td className="actions">
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTransaction(transaction._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;