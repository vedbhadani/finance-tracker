const db = require("../config/db");

const getSummary = async (userId) => {
  const query = `
    SELECT 
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense
    FROM transactions 
    WHERE user_id = $1
  `;

  const result = await db.query(query, [userId]);
  const { total_income, total_expense } = result.rows[0];

  const income = parseFloat(total_income);
  const expense = parseFloat(total_expense);
  const savings = income - expense;

  return {
    total_income: income,
    total_expense: expense,
    savings: savings,
  };
};

module.exports = {
  getSummary,
};
