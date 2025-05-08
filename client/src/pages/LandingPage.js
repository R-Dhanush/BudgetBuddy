import './LandingPage.css';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Take Control of Your Finances</h1>
          <p>BudgetBuddy helps you track expenses, manage budgets, and achieve your financial goals.</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Financial planning illustration" 
            className="hero-img"
          />
        </div>
      </section>

      <section className="features">
        <h2>Why Choose BudgetBuddy?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Expense Tracking</h3>
            <p>Easily track all your income and expenses in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Budget Planning</h3>
            <p>Set monthly budgets and get alerts when you're overspending.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Visual Reports</h3>
            <p>Beautiful charts to help you understand your spending habits.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Transform Your Finances?</h2>
        <p>Join thousands of users who are taking control of their money with BudgetBuddy.</p>
        <Link to="/register" className="btn-primary">
          Sign Up Free
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;