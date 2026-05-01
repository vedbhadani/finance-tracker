const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const loggerMiddleware = require("./middleware/loggerMiddleware");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const healthRoutes = require("./routes/healthRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());

// Body Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Folder for Uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging Middleware
app.use(loggerMiddleware);

// Routes
app.use("/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/budgets", budgetRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Fisher API" });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
