import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TrendsChart.css';

const TrendsChart = ({ data, type = 'weekly' }) => {
  // Process data for chart
  const processWeeklyData = (weeklyTrends) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = Array(7).fill().map((_, i) => ({
      name: days[i],
      income: 0,
      expense: 0
    }));

    weeklyTrends.forEach(item => {
      const dayIndex = item._id.day - 1; // MongoDB dayOfWeek is 1-7 (Sun-Sat)
      result[dayIndex][item._id.type] = item.total;
    });

    return result;
  };

  const processMonthlyData = (monthlyTrends) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const result = [];
    
    // Group by month-year
    const grouped = monthlyTrends.reduce((acc, item) => {
      const key = `${item._id.year}-${item._id.month}`;
      if (!acc[key]) {
        acc[key] = {
          name: `${months[item._id.month - 1]} ${item._id.year}`,
          income: 0,
          expense: 0
        };
      }
      acc[key][item._id.type] = item.total;
      return acc;
    }, {});

    return Object.values(grouped).slice(-6); // Last 6 months
  };

  const chartData = type === 'weekly' 
    ? processWeeklyData(data.weeklyTrends)
    : processMonthlyData(data.monthlyTrends);

  return (
    <div className="trends-chart-container">
      <h3>{type === 'weekly' ? 'Weekly Trends' : 'Monthly Trends'}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
          <Legend />
          <Bar dataKey="income" fill="#4fc3a1" name="Income" />
          <Bar dataKey="expense" fill="#e74c3c" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendsChart;