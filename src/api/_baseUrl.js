import axios from "axios";

export const api = axios.create({
    //baseURL: `http://${import.meta.env.VITE_SERVER_HOST}:${import.meta.env.VITE_SERVER_PORT}`
    baseURL: `https://${import.meta.env.VITE_SERVER}`
})