
const BASE_URL = import.meta.env.VITE_API_URL;

async function request(method, path, body, { blob = false } = {}) {
  const headers = { Accept: "application/json" };

  const token = localStorage.getItem("token");

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const isForm = body instanceof FormData;

  if (body !== undefined && !isForm) {
    headers["Content-Type"] = "application/json";
  }

  let res;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isForm
            ? body
            : JSON.stringify(body),
    });
  } catch (error) {
    console.error("API Connection Error:", error);

    if (!navigator.onLine) {
      throw new Error(
        "No internet connection. Please check your network and try again."
      );
    }

    throw new Error(
      "Something went wrong. Please try again in a moment."
    );
  }

  if (res.ok && blob) {
    return res.blob();
  }

  const data =
    res.status === 204
      ? null
      : await res.json().catch(() => null);

  if (!res.ok) {
    let message;

    switch (res.status) {
      case 400:
        message = data?.message || "Invalid request. Please try again.";
        break;

      case 401:
        message = "Your session has expired. Please log in again.";
        break;

      case 403:
        message = "You don't have permission to perform this action.";
        break;

      case 404:
        message = "We couldn't find what you're looking for.";
        break;

      case 419:
        message = "Your session has expired. Please refresh and try again.";
        break;

      case 422:
        message = data?.message || "Please check the information you entered.";
        break;

      case 429:
        message = "Too many requests. Please wait a moment.";
        break;

      case 500:
        message = "Something went wrong on our end. Please try again later.";
        break;

      case 502:
      case 503:
      case 504:
        message = "Our server is temporarily unavailable. Please try again shortly.";
        break;

      default:
        message = data?.message || "Something went wrong. Please try again.";
    }

    const error = new Error(message);

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
