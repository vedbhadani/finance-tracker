import api from "./api";

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  if (response.data && response.data.data && response.data.data.token) {
    localStorage.setItem("token", response.data.data.token);
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
