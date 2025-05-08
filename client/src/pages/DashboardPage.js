import { useDashboard } from '../context/DashboardContext';
import SummaryCards from '../components/SummaryCards';
import CategoryPieChart from '../components/CategoryPieChart';
import TrendsChart from '../components/TrendsChart';
import BudgetStatus from '../components/BudgetStatus';
import './DashboardPage.css';

const DashboardPage = () => {
  const { dashboardData, loading } = useDashboard();

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!dashboardData) return <div className="no-data">No data available</div>;

  return (
    <div className="dashboard-page">
      <h1>Dashboard Overview</h1>
      
      <section className="dashboard-section">
        <SummaryCards data={dashboardData.summary} />
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-section">
          <BudgetStatus />
        </section>

        <section className="dashboard-section">
          {dashboardData.topCategories.length > 0 ? (
            <CategoryPieChart data={dashboardData.topCategories} />
          ) : (
            <div className="no-data">No category data available</div>
          )}
        </section>
      </div>

      <section className="dashboard-section">
        <TrendsChart data={dashboardData} type="weekly" />
      </section>

      <section className="dashboard-section">
        <TrendsChart data={dashboardData} type="monthly" />
      </section>
    </div>
  );
};

export default DashboardPage;