import api from "./client";

export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);
export const logoutUser = () => api.post("/logout");

export const googleLogin = async (token, role) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ id_token: token, role: role }),
  });
  
  const data = await response.json();
  if (!response.ok) throw data;
  return data;
};