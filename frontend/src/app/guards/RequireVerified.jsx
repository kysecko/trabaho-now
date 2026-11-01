import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RequireVerified({ role }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // 1. Not logged in -> Login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // 2. Email not verified -> Verify Email page (Avoid loop if already there)
  if (!user.email_verified_at) {
    if (location.pathname === "/verify-email") return <Outlet />;
    return <Navigate to="/verify-email" replace />;
  }

  // 3. Identity not verified -> Onboarding page (Avoid loop if already there)
  const isIdentityVerified = user?.is_verified === true || user?.verification_status === 'approved';
  
  if (!isIdentityVerified) {
    // If they are already trying to access a verification route, let them through
    if (location.pathname.startsWith("/verify")) return <Outlet />;
    
    return <Navigate to="/verify" replace />;
  }

  // 4. Wrong role
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return <Outlet />;
}