import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:import.meta.env.MODE==="development"?"https://fullstack-chattingapp-backend.onrender.com":"/api",
    withCredentials:true
})

axiosInstance.defaults.withCredentials=true;
