import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireVerified({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (!user.email_verified_at) {
    return <Navigate to="/verify" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return <Outlet />;
}