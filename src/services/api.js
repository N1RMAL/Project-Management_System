import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Your Django API base URL
});

// Add Authorization header to all requests
API.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("access_token");
    
    // Check if the token is expired and refresh it
    if (token) {
      const isTokenExpired = (token) => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.exp * 1000 < Date.now();
        } catch {
          return true;
        }
      };

      if (isTokenExpired(token)) {
        try {
          const { access } = await refreshToken();
          token = access;
        } catch (error) {
          console.error("Error refreshing token:", error.message || error);
          logout();
          throw new Error("Session expired. Please log in again.");
        }
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle users
export const getUsers = async () => {
  try {
    const response = await API.get("users/");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
};

// Handle tasks
export const getTasks = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`tasks/?${queryString}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error.response?.data || error.message);
    throw error;
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await API.post("tasks/", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error;
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const response = await API.put(`tasks/${taskId}/`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const response = await API.delete(`tasks/${taskId}/`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error.response?.data || error.message);
    throw error;
  }
};

// Handle authentication
export const login = async (credentials) => {
  try {
    const response = await API.post("token/", credentials);
    const { access, refresh } = response.data;

    // Save tokens to localStorage
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    const response = await API.post("token/refresh/", { refresh });
    const { access } = response.data;

    // Update the access token in localStorage
    localStorage.setItem("access_token", access);

    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    throw error;
  }
};

// Handle logout
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export default API;
