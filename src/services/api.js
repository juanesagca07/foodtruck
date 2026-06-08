import axios from "axios";

const api = axios.create({
  baseURL: "https://foodtruck-production-cd82.up.railway.app",
});

export default api;