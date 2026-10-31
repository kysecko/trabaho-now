import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Re-fetch the current user (is_verified, verification_status, ...)
  const refreshUser = useCallback(async () => {
    const u = await api.get("/user");
    setUser(u);
    return u;
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    refreshUser()
      .catch((err) => {
        if (err.status === 401) localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, [refreshUser]);

  // 👇 UPDATED LOGIN FUNCTION
  const login = async (token, user) => {
    localStorage.setItem("token", token);
    setUser(user); // Set the initial user
    try {
      // Fetch the complete user data from the database to ensure is_verified is accurate
      await refreshUser(); 
    } catch (e) {
      console.error("Failed to sync user data:", e);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);