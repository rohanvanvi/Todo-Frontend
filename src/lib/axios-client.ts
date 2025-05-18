import { CustomError } from "@/types/custom-error.type";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

// Keep track of if we're already redirecting to avoid loops
let isRedirecting = false;

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response || {};

    // Handle 401 errors
    if (status === 401) {
      // Only redirect if we're not already doing so and not on the login page
      if (!isRedirecting && !window.location.pathname.includes('/login')) {
        isRedirecting = true;
        window.location.href = "/login";
        return Promise.reject(error);
      }
      // If we're already on login or redirecting, just reject normally
      return Promise.reject(error);
    }

    const customError: CustomError = {
      ...error,
      errorCode: data?.errorCode || "UNKNOWN_ERROR",
    };

    return Promise.reject(customError);
  }
);

export default API;