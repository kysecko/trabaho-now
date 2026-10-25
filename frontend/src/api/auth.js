import api from "./client";

export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);
export const logoutUser = () => api.post("/logout");

export const sendOtp = () => api.post("/email/otp");
export const verifyOtp = (code) => api.post("/email/otp/verify", { code });
export const forgotPassword = (email) => api.post("/forgot-password", { email });
export const resetPassword = (data) => api.post("/reset-password", data);
