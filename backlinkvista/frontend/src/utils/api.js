import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Validate response structure
    if (!response.data) {
      throw {
        message: "Invalid server response",
        response: {
          status: 500,
          data: { message: "Server returned empty response" }
        }
      };
    }
    return response.data;
  },
  async (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        message: "Network error - please check your connection",
        isNetworkError: true,
        code: "NETWORK_ERR"
      });
    }

    const originalRequest = error.config;
    
    // Handle 401 Unauthorized (token refresh)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");
        
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`, 
          { refreshToken }
        );
        
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.log(refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login?session=expired";
        return Promise.reject({
          message: "Session expired - please login again",
          code: "SESSION_EXPIRED"
        });
      }
    }

    // Standard error response format
    return Promise.reject({
      message: error.response.data?.message || "Request failed",
      status: error.response.status,
      code: error.response.data?.code || `HTTP_${error.response.status}`,
      data: error.response.data,
      isAxiosError: true
    });
  }
);

export const endpoints = {
  auth: {
    login: (data) => api.post("/api/auth/login", data),
    register: (data) => api.post("/api/auth/register", data),
    logout: () => api.post("/api/auth/logout"),
    refreshToken: () => api.post("/api/auth/refresh"),
  },
  marketplace: {
    getWebsites: (filters) => api.get("/api/marketplace/websites", { params: filters }),
    getWebsite: (id) => api.get(`/api/marketplace/websites/${id}`),
    addToCart: (data) => api.post("/api/marketplace/cart/add", data),
    removeFromCart: (websiteId, userId) => 
      api.delete(`/api/marketplace/cart/remove/${websiteId}`, { data: { userId } }),
    checkout: (cartItems) => api.post("/api/marketplace/checkout", { items: cartItems }),
    // getCartItems: (userId) => api.get(`/api/marketplace/cart/${userId}`),
    // getCartCount: (userId) => api.get(`/api/marketplace/cart/${userId}/count`),
    getCartItems: (userId) => api.get(`/api/marketplace/cart/get-cart/${userId}`),
    getCartCount: (userId) => api.get(`/api/marketplace/cart/${userId}/total`),

    clearCart: (userId) => api.delete(`/api/marketplace/cart/${userId}`),
  },
  // ... other endpoints remain the same but ensure /api prefix
};

export default api;
