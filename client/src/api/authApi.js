import api from "./axios";

export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const logoutUser = () => api.post("/auth/logout");
export const verifyUser = (data) => api.post("/auth/verify-account", data);
export const getUser = () => api.get("/user");
