import './SummaryCards.css';

const SummaryCards = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="summary-cards">
      <div className="summary-card income">
        <h3>Total Income</h3>
        <p>{formatCurrency(data.totalIncome)}</p>
      </div>
      <div className="summary-card expense">
        <h3>Total Expenses</h3>
        <p>{formatCurrency(data.totalExpenses)}</p>
      </div>
      <div className="summary-card balance">
        <h3>Current Balance</h3>
        <p>{formatCurrency(data.balance)}</p>
      </div>
    </div>
  );
};

export default SummaryCards;