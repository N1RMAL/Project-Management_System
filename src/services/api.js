import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Your Django API base URL
});

// Add token to requests if logged in
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//handle users
export const getUsers = async () => {
  try {
    const response = await API.get("users/"); // Ensure this endpoint exists
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    throw error;
  }
};

// Handle tasks
// export const getTasks = async (params = {}) => {
//   try {
//     const queryString = new URLSearchParams(params).toString(); // Convert params to query string
//     const response = await API.get(`tasks/?${queryString}`); // Add query parameters to the URL
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     throw error; // Propagate the error to the calling function
//   }
// };
export const getTasks = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await API.get(`tasks/?${queryString}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzM0NjkyNjQ2LCJpYXQiOjE3MzQ2OTIzNDYsImp0aSI6ImY0ZDIxNTNjYTdkMDRhYjFhZWI3YjAzOTNlNWUyYjU0IiwidXNlcl9pZCI6MX0.XMq6Ri2doZzvoxgt31lJuq8Ybt9uG4ZN_2UMSIZo6ZU")}`, // Pass stored token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error.message || error);
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
