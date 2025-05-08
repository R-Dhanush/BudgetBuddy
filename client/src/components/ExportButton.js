import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import './ExportButton.css';

const ExportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { exportTransactions } = useTransactions();

  const handleExport = async (format) => {
    try {
      await exportTransactions(format);
      setIsOpen(false);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="export-container">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="export-btn"
      >
        Export Transactions
      </button>
      
      {isOpen && (
        <div className="export-options">
          <button onClick={() => handleExport('csv')} className="export-option">
            Export as CSV
          </button>
          <button onClick={() => handleExport('json')} className="export-option">
            Export as JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;