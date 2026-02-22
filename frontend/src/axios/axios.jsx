import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fullstack-chattingapp-backend.onrender.com/api";

export const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});