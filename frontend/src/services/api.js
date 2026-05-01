import axios from "axios";

// Create an instance of axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors (e.g., redirect to login)
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // Optional: window.location.href = '/login';
      }

      const message = error.response.data.message || "Something went wrong";
      console.error("API Error:", message);
    } else if (error.request) {
      console.error("Network Error: No response received");
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

// Helper methods
export const get = (url, config = {}) => api.get(url, config);
export const post = (url, data, config = {}) => api.post(url, data, config);
export const put = (url, data, config = {}) => api.put(url, data, config);
export const del = (url, config = {}) => api.delete(url, config);

export default api;
