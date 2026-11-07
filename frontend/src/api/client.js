const API_URL = import.meta.env.VITE_API_URL || "https://trabaho-now-api.onrender.com/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token"); // <--- Read fresh every time
  
  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  // Only set Content-Type if not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = response.status;
    error.errors = data?.errors;
    throw error;
  }

  return data;
}

export default {
  get: (url) => request(url, { method: "GET" }),
  post: (url, body) => request(url, { method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (url, body) => request(url, { method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (url) => request(url, { method: "DELETE" }),
};