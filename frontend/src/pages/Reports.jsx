import { useState, useEffect } from "react";
import reportService from "../services/reportService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const Reports = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [filters, setFilters] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    handleFetchReport();
  }, []);

  const handleFetchReport = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await reportService.getMonthlyReport(
        filters.month,
        filters.year,
      );
      if (response.success) {
        setReport(response.data);
      }
    } catch (err) {
      setError("Failed to fetch report data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const barData = report
    ? {
        labels: ["Income", "Expenses", "Savings"],
        datasets: [
          {
            label: "Amount ($)",
            data: [
              report.summary.total_income,
              report.summary.total_expense,
              report.summary.savings,
            ],
            backgroundColor: ["#4caf50", "#f44336", "#2196f3"],
          },
        ],
      }
    : null;

  const pieData = report
    ? {
        labels: report.categories.map((c) => c.name),
        datasets: [
          {
            data: report.categories.map((c) => c.total),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
          },
        ],
      }
    : null;

  return (
    <div className="container">
      <h1>Monthly Reports</h1>

      {/* Filters */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div className="form-group">
            <label>Month</label>
            <select
              value={filters.month}
              onChange={(e) =>
                setFilters({ ...filters, month: e.target.value })
              }
              style={{
                padding: "0.5rem",
                borderRadius: "4px",
                background: "#2a2a2a",
                color: "white",
                border: "1px solid #333",
              }}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              style={{ width: "100px" }}
            />
          </div>
          <button onClick={handleFetchReport} disabled={loading}>
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: "#f44336", marginBottom: "1rem" }}>{error}</div>
      )}

      {report && (
        <>
          {/* Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div className="card" style={{ borderLeft: "4px solid #4caf50" }}>
              <p style={{ color: "#888", margin: 0 }}>Monthly Income</p>
              <h3>
                ${parseFloat(report.summary.total_income).toLocaleString()}
              </h3>
            </div>
            <div className="card" style={{ borderLeft: "4px solid #f44336" }}>
              <p style={{ color: "#888", margin: 0 }}>Monthly Expenses</p>
              <h3>
                ${parseFloat(report.summary.total_expense).toLocaleString()}
              </h3>
            </div>
            <div className="card" style={{ borderLeft: "4px solid #2196f3" }}>
              <p style={{ color: "#888", margin: 0 }}>Monthly Savings</p>
              <h3>${parseFloat(report.summary.savings).toLocaleString()}</h3>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {/* Visualizations */}
            <div className="card">
              <h3>Summary Overview</h3>
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            <div className="card">
              <h3>Expense Breakdown</h3>
              {report.categories.length > 0 ? (
                <Pie data={pieData} />
              ) : (
                <p
                  style={{
                    textAlign: "center",
                    color: "#888",
                    marginTop: "2rem",
                  }}
                >
                  No expense data for this period
                </p>
              )}
            </div>

            {/* Table Breakdown */}
            <div className="card" style={{ gridColumn: "span 2" }}>
              <h3>Category-wise Breakdown</h3>
              <table
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "1px solid #333",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "0.8rem" }}>Category</th>
                    <th style={{ padding: "0.8rem" }}>Type</th>
                    <th style={{ padding: "0.8rem", textAlign: "right" }}>
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.categories.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #222" }}>
                      <td style={{ padding: "0.8rem" }}>{item.name}</td>
                      <td style={{ padding: "0.8rem" }}>
                        <span
                          style={{
                            color:
                              item.type === "income" ? "#4caf50" : "#f44336",
                          }}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "0.8rem",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ${parseFloat(item.total).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
