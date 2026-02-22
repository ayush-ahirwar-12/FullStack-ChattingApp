import axios from "axios";

export const axiosInstance = axios.create({
    baseURL:"https://fullstack-chattingapp-backend.onrender.com",
    withCredentials:true
})

axiosInstance.defaults.withCredentials=true;
