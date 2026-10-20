import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function useRequireVerified() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (action) => {
    if (user?.is_verified) return action();
    navigate("/dashboard/verify", { state: { from: location.pathname } });
  };
}