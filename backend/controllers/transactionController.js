const transactionService = require("../services/transactionService");
const categoryService = require("../services/categoryService");
const budgetService = require("../services/budgetService");
const emailService = require("../services/emailService");
const currencyService = require("../services/currencyService");

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
const createTransaction = async (req, res, next) => {
  const { category_id, amount, type, date, description, currency } = req.body;

  if (amount === undefined || !type) {
    res.status(400);
    return next(new Error("Please provide amount and type"));
  }

  if (!["income", "expense"].includes(type)) {
    res.status(400);
    return next(new Error("Type must be either income or expense"));
  }

  try {
    // Validate category ownership if provided
    if (category_id) {
      const category = await categoryService.getCategoryById(category_id);
      if (!category || category.user_id !== req.user.id) {
        res.status(400);
        return next(new Error("Invalid category or unauthorized"));
      }
    }

    // Currency Conversion
    let converted_amount = amount;
    let exchange_rate = 1.0;

    if (currency && currency !== (process.env.BASE_CURRENCY || "INR")) {
      const conversion = await currencyService.convertAmount(amount, currency);
      converted_amount = conversion.convertedAmount;
      exchange_rate = conversion.exchangeRate;
    }

    const transaction = await transactionService.createTransaction(
      req.user.id,
      {
        category_id,
        amount,
        type,
        date,
        description,
        currency: currency || "USD",
        converted_amount,
        exchange_rate,
      },
    );

    res.status(201).json({
      success: true,
      data: transaction,
    });

    // Check budget after successful transaction (only for expenses)
    if (transaction.type === "expense" && transaction.category_id) {
      const transDate = new Date(transaction.date);
      const budgetStatus = await budgetService.checkCategoryBudget(
        req.user.id,
        transaction.category_id,
        transDate.getMonth() + 1,
        transDate.getFullYear(),
      );

      if (budgetStatus && budgetStatus.is_exceeded) {
        await emailService.sendBudgetExceedNotification(
          req.user.email,
          budgetStatus.category_name,
          budgetStatus.limit_amount,
          budgetStatus.spent_amount,
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all user transactions with filtering
 * @route   GET /api/transactions
 * @access  Private
 */
const getTransactions = async (req, res, next) => {
  try {
    const { category_id, startDate, endDate } = req.query;
    const transactions = await transactionService.getTransactions(req.user.id, {
      category_id,
      startDate,
      endDate,
    });

    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a transaction
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
const updateTransaction = async (req, res, next) => {
  const { category_id, amount, type, date, description, currency } = req.body;

  try {
    let transaction = await transactionService.getTransactionById(
      req.params.id,
    );

    if (!transaction) {
      res.status(404);
      return next(new Error("Transaction not found"));
    }

    if (transaction.user_id !== req.user.id) {
      res.status(401);
      return next(new Error("Not authorized to update this transaction"));
    }

    // Validate category ownership if updated
    if (category_id && category_id !== transaction.category_id) {
      const category = await categoryService.getCategoryById(category_id);
      if (!category || category.user_id !== req.user.id) {
        res.status(400);
        return next(new Error("Invalid category or unauthorized"));
      }
    }

    // Currency Conversion if updated
    let converted_amount = transaction.converted_amount;
    let exchange_rate = transaction.exchange_rate;

    const newAmount = amount !== undefined ? amount : transaction.amount;
    const newCurrency = currency || transaction.currency;

    if (newCurrency !== (process.env.BASE_CURRENCY || "INR")) {
      const conversion = await currencyService.convertAmount(
        newAmount,
        newCurrency,
      );
      converted_amount = conversion.convertedAmount;
      exchange_rate = conversion.exchangeRate;
    } else {
      converted_amount = newAmount;
      exchange_rate = 1.0;
    }

    const updatedTransaction = await transactionService.updateTransaction(
      req.params.id,
      req.user.id,
      {
        category_id: category_id || transaction.category_id,
        amount: amount !== undefined ? amount : transaction.amount,
        type: type || transaction.type,
        date: date || transaction.date,
        description: description || transaction.description,
        currency: newCurrency,
        converted_amount,
        exchange_rate,
      },
    );

    res.json({
      success: true,
      data: updatedTransaction,
    });

    // Check budget after successful update (only for expenses)
    if (
      updatedTransaction.type === "expense" &&
      updatedTransaction.category_id
    ) {
      const transDate = new Date(updatedTransaction.date);
      const budgetStatus = await budgetService.checkCategoryBudget(
        req.user.id,
        updatedTransaction.category_id,
        transDate.getMonth() + 1,
        transDate.getFullYear(),
      );

      if (budgetStatus && budgetStatus.is_exceeded) {
        await emailService.sendBudgetExceedNotification(
          req.user.email,
          budgetStatus.category_name,
          budgetStatus.limit_amount,
          budgetStatus.spent_amount,
        );
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
    );

    if (!transaction) {
      res.status(404);
      return next(new Error("Transaction not found"));
    }

    if (transaction.user_id !== req.user.id) {
      res.status(401);
      return next(new Error("Not authorized to delete this transaction"));
    }

    await transactionService.deleteTransaction(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Transaction removed",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload receipt for a transaction
 * @route   POST /api/transactions/:id/receipt
 * @access  Private
 */
const uploadReceipt = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
    );

    if (!transaction) {
      res.status(404);
      return next(new Error("Transaction not found"));
    }

    if (transaction.user_id !== req.user.id) {
      res.status(401);
      return next(
        new Error("Not authorized to upload receipt for this transaction"),
      );
    }

    if (!req.file) {
      res.status(400);
      return next(new Error("Please upload a file"));
    }

    const receiptUrl = `/uploads/receipts/${req.file.filename}`;

    const updatedTransaction = await transactionService.updateReceiptUrl(
      req.params.id,
      req.user.id,
      receiptUrl,
    );

    res.json({
      success: true,
      data: updatedTransaction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  uploadReceipt,
};
