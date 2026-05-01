import api from "./api";

const getMonthlyReport = async (month, year) => {
  const response = await api.get("/reports/monthly", {
    params: { month, year },
  });
  return response.data;
};

const reportService = {
  getMonthlyReport,
};

export default reportService;
