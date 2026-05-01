const db = require("../config/db");
const bcrypt = require("bcryptjs");

const createUser = async (name, email, password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at
  `;
  const values = [name, email, hashedPassword];

  const result = await db.query(query, values);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await db.query(query, [email]);
  return result.rows[0];
};

const getUserById = async (id) => {
  const query = "SELECT id, name, email, created_at FROM users WHERE id = $1";
  const result = await db.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
