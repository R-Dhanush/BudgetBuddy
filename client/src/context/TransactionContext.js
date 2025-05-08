import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: '',
    category: ''
  });
  const { token } = useAuth();

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      
      if (filters.startDate) query.append('startDate', filters.startDate);
      if (filters.endDate) query.append('endDate', filters.endDate);
      if (filters.type) query.append('type', filters.type);
      if (filters.category) query.append('category', filters.category);

      const response = await fetch(`http://localhost:5000/api/v1/transactions?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setTransactions(data.data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(transaction)
      });

      const data = await response.json();
      await fetchTransactions();
      return data;
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  const updateTransaction = async (id, updates) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      await fetchTransactions();
      return data;
    } catch (err) {
      console.error('Error updating transaction:', err);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/v1/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      throw err;
    }
  };

  const exportTransactions = async (format) => {
    try {
      const query = new URLSearchParams();
      
      if (filters.startDate) query.append('startDate', filters.startDate);
      if (filters.endDate) query.append('endDate', filters.endDate);
      if (filters.type) query.append('type', filters.type);
      if (filters.category) query.append('category', filters.category);
      query.append('format', format);
  
      const response = await fetch(`http://localhost:5000/api/v1/transactions/export?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) throw new Error('Export failed');
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error('Error exporting transactions:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
    }
  }, [token, filters]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        filters,
        setFilters,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        exportTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};