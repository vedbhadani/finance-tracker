const db = require("../config/db");

const getMonthlyReport = async (userId, month, year) => {
  // Summary Query
  const summaryQuery = `
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense
    FROM transactions 
    WHERE user_id = $1 
    AND EXTRACT(MONTH FROM date) = $2 
    AND EXTRACT(YEAR FROM date) = $3
  `;

  // Category Breakdown Query
  const breakdownQuery = `
    SELECT 
      c.name as category_name,
      c.type as category_type,
      SUM(t.amount) as total
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
    AND EXTRACT(MONTH FROM t.date) = $2
    AND EXTRACT(YEAR FROM t.date) = $3
    GROUP BY c.name, c.type
    ORDER BY total DESC
  `;

  const [summaryRes, breakdownRes] = await Promise.all([
    db.query(summaryQuery, [userId, month, year]),
    db.query(breakdownQuery, [userId, month, year]),
  ]);

  const { total_income, total_expense } = summaryRes.rows[0];
  const income = parseFloat(total_income);
  const expense = parseFloat(total_expense);

  return {
    month,
    year,
    summary: {
      total_income: income,
      total_expense: expense,
      savings: income - expense,
    },
    categories: breakdownRes.rows.map((row) => ({
      name: row.category_name,
      type: row.category_type,
      total: parseFloat(row.total),
    })),
  };
};

module.exports = {
  getMonthlyReport,
};
