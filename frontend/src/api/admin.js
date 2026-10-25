import api from "./client";

// ID Queue
export const getIdQueue = (status = "pending") =>
  api.get(`/admin/id-queue?status=${status}`);

export const approveId = (id) => 
  api.post(`/admin/id-queue/${id}/approve`, {});

export const rejectId = (id, reason) =>
  api.post(`/admin/id-queue/${id}/reject`, { reason });

export const fetchIdImage = (id, type) =>
  api.blob(`/admin/id-queue/${id}/file/${type}`);

// Users
export const getUsers = (role, status) => {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (status) params.append("status", status);

  const queryString = params.toString();
  const url = queryString ? `/admin/users?${queryString}` : "/admin/users";
  
  return api.get(url); 
};