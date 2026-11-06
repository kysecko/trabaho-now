import api from "./client";

export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);
export const logoutUser = () => api.post("/logout");

export const sendOtp = (email) => api.post("/email/otp", { email });
export const verifyOtp = (email, code) => api.post("/email/otp/verify", { email, code });

export const forgotPassword = (email) => api.post("/forgot-password", { email });
export const resetPassword = (data) => api.post("/reset-password", data);