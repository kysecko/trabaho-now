import api from "./client";

export const getVerification = () => api.get("/verification");

// formData: id_type, id_front, id_back (optional), selfie
export const submitVerification = (formData) => api.post("/verification", formData);