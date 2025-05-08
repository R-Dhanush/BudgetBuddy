import { useState } from 'react';
import BudgetForm from '../components/BudgetForm';
import BudgetStatus from '../components/BudgetStatus';
import './BudgetPage.css';

const BudgetPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h2>Budget Planning</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn"
        >
          {showForm ? 'Hide Form' : 'Set New Budget'}
        </button>
      </div>

      {showForm && (
        <div className="budget-form-container">
          <BudgetForm />
        </div>
      )}

      <div className="budget-status-container">
        <BudgetStatus />
      </div>
    </div>
  );
};

export default BudgetPage;