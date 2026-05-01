import api from "./api";

const getSummary = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

const dashboardService = {
  getSummary,
};

export default dashboardService;
