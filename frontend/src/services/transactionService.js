import api from "./api";

const getTransactions = async (params = {}) => {
  const response = await api.get("/transactions", { params });
  return response.data;
};

const createTransaction = async (transactionData) => {
  const response = await api.post("/transactions", transactionData);
  return response.data;
};

const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

const uploadReceipt = async (id, formData) => {
  const response = await api.post(`/transactions/${id}/receipt`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

const transactionService = {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  uploadReceipt,
};

export default transactionService;
