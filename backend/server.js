const app = require("./app");
const { pool } = require("./config/db");

const PORT = process.env.PORT || 5001;

// Test Database Connection before starting server
const startServer = async () => {
  try {
    // Optional: Test DB connection on startup
    // await pool.query('SELECT NOW()');
    // console.log('Database connection verified');

    app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
      );
    });
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
