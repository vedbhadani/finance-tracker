const reportService = require("../services/reportService");

/**
 * @desc    Get monthly financial report
 * @route   GET /api/reports/monthly
 * @access  Private
 */
const getMonthlyReport = async (req, res, next) => {
  let { month, year } = req.query;

  // Default to current month/year if not provided
  const now = new Date();
  month = month ? parseInt(month) : now.getMonth() + 1;
  year = year ? parseInt(year) : now.getFullYear();

  if (isNaN(month) || month < 1 || month > 12) {
    res.status(400);
    return next(new Error("Invalid month. Must be between 1 and 12"));
  }

  if (isNaN(year) || year < 2000 || year > 2100) {
    res.status(400);
    return next(new Error("Invalid year"));
  }

  try {
    const report = await reportService.getMonthlyReport(
      req.user.id,
      month,
      year,
    );

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMonthlyReport,
};
