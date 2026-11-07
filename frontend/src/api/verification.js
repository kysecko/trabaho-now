import api from "./client";

// The current user's latest verification request (or null)
export const getVerification = () => api.get("/verification");

// Send the form built by buildVerificationFormData()
export const submitVerification = (formData) => api.post("/verification", formData);

// Text fields go in as-is; files go in as documents[<key>]:
//   documents[govId], documents[selfie], documents[residency]  (+ documents[nbi] for jobseekers)
export function buildVerificationFormData(data, files) {
  const body = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) body.append(key, value);
  });

  Object.entries(files).forEach(([key, file]) => {
    if (file) body.append(`documents[${key}]`, file);
  });

  return body;
}

// Prefer the first field-level validation message over Laravel's generic one
export function verificationError(err) {
  const firstFieldError = err?.errors ? Object.values(err.errors)[0]?.[0] : null;
  return firstFieldError || err?.message || "Something went wrong. Please try again.";
}