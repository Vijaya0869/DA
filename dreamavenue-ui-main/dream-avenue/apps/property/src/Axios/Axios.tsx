import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Base configuration
const apiInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Add Authorization token if it exists
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors (e.g., network failure before sending)
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return response.data directly for simplicity
    return response;
  },
  (error: AxiosError) => {
    // Handle response errors globally
    if (error.response) {
      const { status } = error.response;

      // Handle specific status codes
      if (status === 401) {
        // Token expired or unauthorized - trigger logout or refresh
        console.error("Unauthorized - logging out...");
        localStorage.removeItem("ACCESS_TOKEN");
        // Optionally redirect to login: window.location.href = "/login";
      } else if (status === 403) {
        console.error("Forbidden - insufficient permissions");
      } else if (status === 500) {
        console.error("Server error - please try again later");
      }
    } else if (error.request) {
      // No response received (e.g., network error)
      console.error("Network error - check your connection");
    } else {
      // Other errors (e.g., config issues)
      console.error("Unexpected error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
