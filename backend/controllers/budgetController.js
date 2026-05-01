const budgetService = require("../services/budgetService");
const categoryService = require("../services/categoryService");

/**
 * @desc    Set or update a budget for a category
 * @route   POST /api/budgets
 * @access  Private
 */
const setBudget = async (req, res, next) => {
  const { category_id, limit_amount, month, year } = req.body;

  if (!category_id || limit_amount === undefined || !month || !year) {
    res.status(400);
    return next(
      new Error("Please provide category_id, limit_amount, month, and year"),
    );
  }

  try {
    // Validate category exists and belongs to user
    const category = await categoryService.getCategoryById(category_id);
    if (!category || category.user_id !== req.user.id) {
      res.status(400);
      return next(new Error("Invalid category or unauthorized"));
    }

    if (category.type !== "expense") {
      res.status(400);
      return next(new Error("Budgets can only be set for expense categories"));
    }

    const budget = await budgetService.createBudget(req.user.id, {
      category_id,
      limit_amount,
      month,
      year,
    });

    res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all budgets with usage for a period
 * @route   GET /api/budgets
 * @access  Private
 */
const getBudgets = async (req, res, next) => {
  let { month, year } = req.query;

  const now = new Date();
  month = month ? parseInt(month) : now.getMonth() + 1;
  year = year ? parseInt(year) : now.getFullYear();

  try {
    const budgets = await budgetService.getBudgetsWithUsage(
      req.user.id,
      month,
      year,
    );

    res.json({
      success: true,
      count: budgets.length,
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  setBudget,
  getBudgets,
};
