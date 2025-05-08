import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(80); // 80% usage
  const { token } = useAuth();

  const fetchCurrentBudget = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/budgets/current', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setBudget(data.data);
      } else {
        setBudget(null);
      }
    } catch (err) {
      console.error('Error fetching budget:', err);
      setBudget(null);
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (month, year, amount) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ month, year, amount })
      });

      const data = await response.json();
      if (data.success) {
        await fetchCurrentBudget();
        return data;
      }
      throw new Error(data.message || 'Failed to create budget');
    } catch (err) {
      console.error('Error creating budget:', err);
      throw err;
    }
  };

  const updateBudget = async (id, updates) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/budgets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        await fetchCurrentBudget();
        return data;
      }
      throw new Error(data.message || 'Failed to update budget');
    } catch (err) {
      console.error('Error updating budget:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentBudget();
    }
  }, [token]);

  return (
    <BudgetContext.Provider
      value={{
        budget,
        loading,
        alertThreshold,
        fetchCurrentBudget,
        createBudget,
        updateBudget
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};