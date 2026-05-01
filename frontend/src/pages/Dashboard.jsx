import { useState, useEffect } from "react";
import dashboardService from "../services/dashboardService";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expenses: 0,
    savings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getSummary();
      if (response.success) {
        setSummary(response.data);
      }
    } catch (err) {
      setError("Failed to fetch dashboard data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [summary.total_income, summary.total_expenses],
        backgroundColor: ["#4caf50", "#f44336"],
        borderColor: ["#388e3c", "#d32f2f"],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="container">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: "2rem" }}>Financial Overview</h1>

      {error && (
        <div style={{ color: "#c62828", marginBottom: "1rem" }}>{error}</div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <div className="card">
          <p style={{ color: "#888", margin: 0 }}>Total Income</p>
          <h2 style={{ color: "#4caf50", margin: "0.5rem 0" }}>
            ${parseFloat(summary.total_income).toLocaleString()}
          </h2>
        </div>
        <div className="card">
          <p style={{ color: "#888", margin: 0 }}>Total Expenses</p>
          <h2 style={{ color: "#f44336", margin: "0.5rem 0" }}>
            ${parseFloat(summary.total_expenses).toLocaleString()}
          </h2>
        </div>
        <div className="card">
          <p style={{ color: "#888", margin: 0 }}>Total Savings</p>
          <h2
            style={{
              color: summary.savings >= 0 ? "#2196f3" : "#f44336",
              margin: "0.5rem 0",
            }}
          >
            ${parseFloat(summary.savings).toLocaleString()}
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div className="card">
          <h3 style={{ marginBottom: "1.5rem" }}>Income vs Expenses</h3>
          <div style={{ maxWidth: "300px", margin: "0 auto" }}>
            {summary.total_income === 0 && summary.total_expenses === 0 ? (
              <p style={{ textAlign: "center", color: "#888" }}>
                No data to display chart
              </p>
            ) : (
              <Doughnut data={chartData} options={{ cutout: "70%" }} />
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Quick Actions</h3>
          <button style={{ width: "100%", marginBottom: "0.8rem" }}>
            Add Transaction
          </button>
          <button
            style={{
              width: "100%",
              marginBottom: "0.8rem",
              backgroundColor: "transparent",
              border: "1px solid #646cff",
            }}
          >
            Download Report
          </button>
          <button
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid #888",
            }}
          >
            Manage Categories
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
