import { useEffect, useState } from 'react';
import { useBudget } from '../context/BudgetContext';
import './BudgetStatus.css';

const BudgetStatus = () => {
  const { budget, loading, alertThreshold } = useBudget();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (budget && budget.percentageUsed >= alertThreshold) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [budget, alertThreshold]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) return <div className="loading">Loading budget...</div>;
  if (!budget) return <div className="no-budget">No budget set for this month</div>;

  return (
    <div className="budget-status">
      <h3>Monthly Budget Status</h3>
      
      {showAlert && (
        <div className={`budget-alert ${budget.remaining < 0 ? 'exceeded' : 'warning'}`}>
          {budget.remaining < 0
            ? '⚠️ You have exceeded your monthly budget!'
            : `⚠️ You've used ${Math.round(budget.percentageUsed)}% of your budget`}
        </div>
      )}

      <div className="budget-meta">
        <div className="budget-amount">
          <span>Budget:</span>
          <strong>{formatCurrency(budget.budget.amount)}</strong>
        </div>
        <div className="budget-dates">
          {new Date(budget.budget.year, budget.budget.month - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="budget-progress">
        <div 
          className="progress-bar"
          style={{ width: `${Math.min(100, budget.percentageUsed)}%` }}
        ></div>
        <div className="progress-labels">
          <span>0%</span>
          <span>{Math.round(budget.percentageUsed)}%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="budget-stats">
        <div className="stat">
          <span>Spent:</span>
          <strong className="expense">{formatCurrency(budget.totalExpenses)}</strong>
        </div>
        <div className="stat">
          <span>Remaining:</span>
          <strong className={budget.remaining < 0 ? 'exceeded' : 'remaining'}>
            {formatCurrency(Math.abs(budget.remaining))}
            {budget.remaining < 0 && ' over'}
          </strong>
        </div>
      </div>
    </div>
  );
};

export default BudgetStatus;