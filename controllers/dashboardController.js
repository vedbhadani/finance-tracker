const dashboardService = require("../services/dashboardService");

/**
 * @desc    Get financial summary for dashboard
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const summary = await dashboardService.getSummary(req.user.id);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
};
