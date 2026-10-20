import api from "./client";

export const getIdQueue = (status = "pending") =>
  api.get(`/admin/id-queue?status=${status}`);

export const approveId = (id) => api.post(`/admin/id-queue/${id}/approve`, {});

export const rejectId = (id, reason) =>
  api.post(`/admin/id-queue/${id}/reject`, { reason });

// type: "front" | "back" | "selfie". Returns a Blob (the token must be sent, so no plain <img src>)
export const fetchIdImage = (id, type) =>
  api.blob(`/admin/id-queue/${id}/file/${type}`);