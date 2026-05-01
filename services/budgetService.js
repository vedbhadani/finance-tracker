const db = require("../config/db");

const createBudget = async (userId, data) => {
  const { category_id, limit_amount, month, year } = data;
  const query = `
    INSERT INTO budgets (user_id, category_id, limit_amount, month, year)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (user_id, category_id, month, year) 
    DO UPDATE SET limit_amount = EXCLUDED.limit_amount
    RETURNING *
  `;
  const values = [userId, category_id, limit_amount, month, year];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getBudgetsWithUsage = async (userId, month, year) => {
  const query = `
    SELECT 
      b.id,
      b.category_id,
      c.name as category_name,
      b.limit_amount,
      b.month,
      b.year,
      COALESCE(SUM(t.amount), 0) as spent_amount
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN transactions t ON t.category_id = b.category_id 
      AND t.user_id = b.user_id 
      AND EXTRACT(MONTH FROM t.date) = b.month 
      AND EXTRACT(YEAR FROM t.date) = b.year
      AND t.type = 'expense'
    WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3
    GROUP BY b.id, c.name
    ORDER BY c.name ASC
  `;

  const result = await db.query(query, [userId, month, year]);

  return result.rows.map((row) => {
    const limit = parseFloat(row.limit_amount);
    const spent = parseFloat(row.spent_amount);
    const usage_percentage = limit > 0 ? (spent / limit) * 100 : 0;

    return {
      ...row,
      limit_amount: limit,
      spent_amount: spent,
      usage_percentage: Math.round(usage_percentage * 100) / 100,
      is_exceeded: spent > limit,
    };
  });
};

const checkCategoryBudget = async (userId, categoryId, month, year) => {
  const query = `
    SELECT 
      b.limit_amount,
      c.name as category_name,
      COALESCE(SUM(t.amount), 0) as spent_amount
    FROM budgets b
    JOIN categories c ON b.category_id = c.id
    LEFT JOIN transactions t ON t.category_id = b.category_id 
      AND t.user_id = b.user_id 
      AND EXTRACT(MONTH FROM t.date) = b.month 
      AND EXTRACT(YEAR FROM t.date) = b.year
      AND t.type = 'expense'
    WHERE b.user_id = $1 AND b.category_id = $2 AND b.month = $3 AND b.year = $4
    GROUP BY b.id, c.name
  `;

  const result = await db.query(query, [userId, categoryId, month, year]);

  if (result.rows.length === 0) return null;

  const { limit_amount, category_name, spent_amount } = result.rows[0];
  const limit = parseFloat(limit_amount);
  const spent = parseFloat(spent_amount);

  return {
    category_name,
    limit_amount: limit,
    spent_amount: spent,
    is_exceeded: spent > limit,
  };
};

module.exports = {
  createBudget,
  getBudgetsWithUsage,
  checkCategoryBudget,
};
