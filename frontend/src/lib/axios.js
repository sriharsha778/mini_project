import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? `http://${window.location.hostname}:5001/api`  // Automatically gets your local IP
      : "/api",
  withCredentials: true,
});
