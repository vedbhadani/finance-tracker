const db = require("../config/db");

const createTransaction = async (userId, data) => {
  const {
    category_id,
    amount,
    type,
    date,
    description,
    currency,
    converted_amount,
    exchange_rate,
  } = data;
  const query = `
    INSERT INTO transactions (user_id, category_id, amount, type, date, description, currency, converted_amount, exchange_rate)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;
  const values = [
    userId,
    category_id,
    amount,
    type,
    date || new Date(),
    description,
    currency || "USD",
    converted_amount,
    exchange_rate,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getTransactions = async (userId, filters = {}) => {
  const { category_id, startDate, endDate } = filters;
  let query =
    "SELECT t.*, c.name as category_name FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = $1";
  const values = [userId];
  let paramCount = 1;

  if (category_id) {
    paramCount++;
    query += ` AND t.category_id = $${paramCount}`;
    values.push(category_id);
  }

  if (startDate) {
    paramCount++;
    query += ` AND t.date >= $${paramCount}`;
    values.push(startDate);
  }

  if (endDate) {
    paramCount++;
    query += ` AND t.date <= $${paramCount}`;
    values.push(endDate);
  }

  query += " ORDER BY t.date DESC, t.created_at DESC";

  const result = await db.query(query, values);
  return result.rows;
};

const getTransactionById = async (id) => {
  const query = "SELECT * FROM transactions WHERE id = $1";
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const updateTransaction = async (id, userId, data) => {
  const {
    category_id,
    amount,
    type,
    date,
    description,
    currency,
    converted_amount,
    exchange_rate,
  } = data;
  const query = `
    UPDATE transactions
    SET category_id = $1, amount = $2, type = $3, date = $4, description = $5, currency = $6, converted_amount = $7, exchange_rate = $8
    WHERE id = $9 AND user_id = $10
    RETURNING *
  `;
  const values = [
    category_id,
    amount,
    type,
    date,
    description,
    currency,
    converted_amount,
    exchange_rate,
    id,
    userId,
  ];
  const result = await db.query(query, values);
  return result.rows[0];
};

const deleteTransaction = async (id, userId) => {
  const query =
    "DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *";
  const result = await db.query(query, [id, userId]);
  return result.rows[0];
};

const updateReceiptUrl = async (id, userId, url) => {
  const query = `
    UPDATE transactions
    SET receipt_url = $1
    WHERE id = $2 AND user_id = $3
    RETURNING *
  `;
  const values = [url, id, userId];
  const result = await db.query(query, values);
  return result.rows[0];
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  updateReceiptUrl,
};
