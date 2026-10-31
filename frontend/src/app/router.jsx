import { Routes, Route } from "react-router-dom";
import Placeholder from "../components/shared/Placeholder";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import SharedLayout from "../components/layout/SharedLayout";

// Guards
import RoleRoute from "./guards/RoleRoute";
import UnverifiedRoute from "./guards/UnVerified";
import RequireVerified from "./guards/RequireVerified";

// Public Pages
import Home from "../pages/public/Home";
import Jobseekers from "../pages/public/JobSeekers";
import Services from "../pages/public/Services";
import HowItWorks from "../pages/public/HowItWorks";
import Privacy from "../pages/public/Privacy";
import Terms from "../pages/public/Terms";
import Download from "../pages/public/Download";  

// Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";

// Shared Pages
import Dashboard from "../pages/shared/Dashboard";
import Verify from "../pages/shared/Verify";
import Browse from "../pages/shared/Browse";
import ProfileDetail from "../pages/shared/ProfileDetail";

// Modular Route Functions
import ClientRoutes from "./routes/clientRoutes";
import JobseekerRoutes from "./routes/jobseekerRoutes";
import AdminRoutes from "./routes/adminRoutes";
import SharedRoutes from "./routes/sharedRoutes";

export default function AppRouter() {
  return (
    <Routes>
      {/* landing page */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        {/* tabs */}
        <Route path="/jobseekers" element={<Jobseekers />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        
        <Route path="/download" element={<Download />} /> 
      </Route>

      {/* separate routes for the legal */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* authentication (open to logged-out and unverified users) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* everything below requires a logged-in user with a verified email */}
      <Route element={<RequireVerified />}>
        {/* shared */}
        <Route element={<RoleRoute role={["client", "jobseeker"]} />}>
          <Route element={<UnverifiedRoute />}>
            <Route element={<SharedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/verify" element={<Verify />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/profile/:id" element={<ProfileDetail />} />
            </Route>
          </Route>
        </Route>

        {ClientRoutes()}
        {JobseekerRoutes()}
        {AdminRoutes()}
        {SharedRoutes()}
      </Route>

      {/* error 404 */}
      <Route path="*" element={<Placeholder title="Page not found" />} />
    </Routes>
  );
}