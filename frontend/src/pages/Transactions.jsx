import { useState, useEffect } from "react";
import transactionService from "../services/transactionService";
import api from "../services/api";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    amount: "",
    category_id: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, catRes] = await Promise.all([
        transactionService.getTransactions(),
        api.get("/categories"),
      ]);
      setTransactions(transRes.data);
      setCategories(catRes.data.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await transactionService.updateTransaction(editingId, form);
      } else {
        await transactionService.createTransaction(form);
      }
      setForm({
        amount: "",
        category_id: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Failed to save transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.deleteTransaction(id);
        fetchData();
      } catch (err) {
        console.error("Failed to delete transaction:", err);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setForm({
      amount: transaction.amount,
      category_id: transaction.category_id || "",
      type: transaction.type,
      date: transaction.date.split("T")[0],
      description: transaction.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="container">
        <h2>Loading transactions...</h2>
      </div>
    );

  return (
    <div className="container">
      <h1>Transactions</h1>

      {/* Add/Edit Form */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3>{editingId ? "Edit Transaction" : "Add New Transaction"}</h3>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          <div className="form-group">
            <label>Amount</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                background: "#2a2a2a",
                color: "white",
                border: "1px solid #333",
              }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                background: "#2a2a2a",
                color: "white",
                border: "1px solid #333",
              }}
            >
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ gridColumn: "span 2" }}>
            <label>Description</label>
            <input
              name="description"
              type="text"
              value={form.description}
              onChange={handleChange}
              placeholder="What was this for?"
            />
          </div>
          <div
            style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}
          >
            <button type="submit" style={{ flex: 1 }}>
              {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    amount: "",
                    category_id: "",
                    type: "expense",
                    date: new Date().toISOString().split("T")[0],
                    description: "",
                  });
                }}
                style={{ backgroundColor: "#444" }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="card" style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #333" }}>
              <th style={{ padding: "1rem" }}>Date</th>
              <th style={{ padding: "1rem" }}>Description</th>
              <th style={{ padding: "1rem" }}>Category</th>
              <th style={{ padding: "1rem" }}>Type</th>
              <th style={{ padding: "1rem" }}>Amount</th>
              <th style={{ padding: "1rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#888",
                  }}
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "1rem" }}>
                    {new Date(t.date).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem" }}>{t.description || "-"}</td>
                  <td style={{ padding: "1rem" }}>
                    {t.category_name || "Uncategorized"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        backgroundColor:
                          t.type === "income"
                            ? "rgba(76, 175, 80, 0.1)"
                            : "rgba(244, 67, 54, 0.1)",
                        color: t.type === "income" ? "#4caf50" : "#f44336",
                      }}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "1rem",
                      fontWeight: "bold",
                      color: t.type === "income" ? "#4caf50" : "#f44336",
                    }}
                  >
                    {t.type === "income" ? "+" : "-"}$
                    {parseFloat(t.amount).toFixed(2)}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleEdit(t)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontSize: "0.8rem",
                          backgroundColor: "transparent",
                          border: "1px solid #646cff",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        style={{
                          padding: "0.3rem 0.6rem",
                          fontSize: "0.8rem",
                          backgroundColor: "transparent",
                          border: "1px solid #f44336",
                          color: "#f44336",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
