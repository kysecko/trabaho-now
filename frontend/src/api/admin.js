import api from "./client";

// ID Queue (old review flow, kept until you retire it)
export const getIdQueue = (status = "pending") =>
  api.get(`/admin/id-queue?status=${status}`);

export const approveId = (id) =>
  api.post(`/admin/id-queue/${id}/approve`, {});

export const rejectId = (id, reason) =>
  api.post(`/admin/id-queue/${id}/reject`, { reason });

export const fetchIdImage = (id, type) =>
  api.blob(`/admin/id-queue/${id}/file/${type}`);

// Verifications (new review flow)
export const getVerifications = (status = "pending") =>
  api.get(`/admin/verifications?status=${status}`);

export const getVerificationDetail = (id) =>
  api.get(`/admin/verifications/${id}`);

export const approveVerification = (id) =>
  api.post(`/admin/verifications/${id}/approve`, {});

export const rejectVerification = (id, reason) =>
  api.post(`/admin/verifications/${id}/reject`, { reason });
export const listCancellations = (cancelledByRole) =>
  api.get(
    `/admin/cancellations${cancelledByRole ? `?cancelled_by_role=${cancelledByRole}` : ""}`
  );

export const adminCancelRequest = (id, { reason, note }) =>
  api.post(`/admin/requests/${id}/cancel`, { reason, note });

export const getUsers = (role, status) => {
  const params = new URLSearchParams();
  if (role) params.append("role", role);
  if (status) params.append("status", status);

  const queryString = params.toString();
  const url = queryString ? `/admin/users?${queryString}` : "/admin/users";

  return api.get(url);
};