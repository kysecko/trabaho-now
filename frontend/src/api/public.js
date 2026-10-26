import api from "./client";

export const getPublicJobseekers = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return api.get(`/public/jobseekers${qs ? `?${qs}` : ""}`);
};