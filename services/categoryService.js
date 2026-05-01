const db = require("../config/db");

const createCategory = async (userId, name, type) => {
  const query = `
    INSERT INTO categories (user_id, name, type)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [userId, name, type];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getCategoriesByUser = async (userId) => {
  const query = "SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC";
  const result = await db.query(query, [userId]);
  return result.rows;
};

const getCategoryById = async (id) => {
  const query = "SELECT * FROM categories WHERE id = $1";
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const deleteCategory = async (id, userId) => {
  const query =
    "DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *";
  const result = await db.query(query, [id, userId]);
  return result.rows[0];
};

module.exports = {
  createCategory,
  getCategoriesByUser,
  getCategoryById,
  deleteCategory,
};
