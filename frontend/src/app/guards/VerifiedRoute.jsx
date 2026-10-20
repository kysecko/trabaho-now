import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function VerifiedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user?.is_verified) {
    return (
      <Navigate
        to="/dashboard/verify"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <Outlet />;
}