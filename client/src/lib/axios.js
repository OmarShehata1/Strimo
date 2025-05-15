import axios from "axios";

const BASE_CLIENT_URL =
  import.meta.env.VITE_BASE_CLIENT_URL || "http://localhost:5173";

const BASE_URL =
  import.meta.env.MODE === "development" ? `${BASE_CLIENT_URL}/api` : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
