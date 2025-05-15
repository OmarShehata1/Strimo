import axios from "axios";

const BASE_CLIENT_URL =
  import.meta.env.VITE_BASE_CLIENT_URL || "http://localhost:5173";

const BASE_URL = `${BASE_CLIENT_URL}/api`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
