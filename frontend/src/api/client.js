const BASE_URL = import.meta.env.VITE_API_URL;

async function request(method, path, body, { blob = false } = {}) {
  const headers = { Accept: "application/json" };
  const token = localStorage.getItem("token");
  if (token) headers.Authorization = `Bearer ${token}`;

  const isForm = body instanceof FormData;
  if (body !== undefined && !isForm) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  if (res.ok && blob) return res.blob();

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || "Something went wrong. Please check your internet connection and try again.");
    error.status = res.status;
    error.errors = data?.errors; 
    error.code = data?.code;   
    throw error;
  }

  return data;
}

const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
  blob: (path) => request("GET", path, undefined, { blob: true }),
};

export default api;