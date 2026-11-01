import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
    try {
      await refreshUser(); 
    } catch (e) {
      console.error("Failed to sync user data:", e);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // 👇 FIX: Memoize the value object so it only changes when user/loading change
  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    refreshUser
  }), [user, loading, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);