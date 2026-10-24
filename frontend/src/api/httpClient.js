import axios from "axios";
import { ENV } from "@/config/env";

/** Shared axios instance for the NestJS backend (all routes are prefixed with /api). */
export const httpClient = axios.create({
  baseURL: ENV.apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Normalise NestJS error payloads ({ statusCode, message, error }) into Error objects.
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message;
    return Promise.reject(new Error(Array.isArray(message) ? message.join(", ") : message || error.message));
  },
);
