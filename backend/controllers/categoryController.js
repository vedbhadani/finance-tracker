const categoryService = require("../services/categoryService");

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private
 */
const createCategory = async (req, res, next) => {
  const { name, type } = req.body;

  if (!name || !type) {
    res.status(400);
    return next(new Error("Please provide name and type"));
  }

  if (!["income", "expense"].includes(type)) {
    res.status(400);
    return next(new Error("Type must be either income or expense"));
  }

  try {
    const category = await categoryService.createCategory(
      req.user.id,
      name,
      type,
    );
    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all user categories
 * @route   GET /api/categories
 * @access  Private
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategoriesByUser(req.user.id);
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    if (!category) {
      res.status(404);
      return next(new Error("Category not found"));
    }

    // Check if category belongs to user
    if (category.user_id !== req.user.id) {
      res.status(401);
      return next(new Error("Not authorized to delete this category"));
    }

    // NOTE: In a full system, we would check if transactions exist for this category.
    // For now, we proceed with deletion as transactions are not yet implemented.

    await categoryService.deleteCategory(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Category removed",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
};
