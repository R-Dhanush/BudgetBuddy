import { useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import './BudgetForm.css';

const BudgetForm = () => {
  const { createBudget } = useBudget();
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBudget(
        parseInt(formData.month),
        parseInt(formData.year),
        parseFloat(formData.amount)
      );
    } catch (err) {
      console.error('Error creating budget:', err);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <h3>Set Monthly Budget</h3>
      <div className="form-group">
        <label>Month</label>
        <select
          name="month"
          value={formData.month}
          onChange={handleChange}
          required
        >
          {months.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Year</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          min="2000"
          max="2100"
          required
        />
      </div>
      <div className="form-group">
        <label>Amount (₹)</label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          min="1"
          step="0.01"
          required
        />
      </div>
      <button type="submit" className="btn-primary">
        Set Budget
      </button>
    </form>
  );
};

export default BudgetForm;