import { Routes, Route, Outlet } from "react-router-dom";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import VerificationLayout from "../components/layout/VerificationLayout";

// Guards
import RoleRoute from "./guards/RoleRoute";

// Context
import { VerifyProvider } from "../context/VerifyContext";

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

// Verification Pages - Shared
import ChooseRole from "../pages/verification/ChooseRole";
import VerifyStart from "../pages/verification/VerifyStart";
import VerifyPending from "../pages/verification/VerifyPending";

// Modular Route Functions
import ClientRoutes from "./routes/clientRoutes";
import JobseekerRoutes from "./routes/jobseekerRoutes";
import AdminRoutes from "./routes/adminRoutes";
import ClientVerificationRoutes from "./routes/clientVerificationRoutes";
import JobseekerVerificationRoutes from "./routes/jobseekerVerificationRoutes";

// Error Pages
import NotFound from "../pages/404NotFound";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobseekers" element={<Jobseekers />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/download" element={<Download />} />
      </Route>

      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Identity Verification Onboarding Flow */}
      <Route element={<RoleRoute role={["client", "jobseeker"]} />}>
        <Route element={<VerificationLayout />}>
          {/* One provider shared by every verification step (client + jobseeker) */}
          <Route
            element={
              <VerifyProvider>
                <Outlet />
              </VerifyProvider>
            }
          >
            {/* Shared Steps */}
            <Route path="/verify" element={<ChooseRole />} />
            <Route path="/verify/start" element={<VerifyStart />} />
            <Route path="/verify/pending" element={<VerifyPending />} />

            {/* Role-specific flows */}
            {ClientVerificationRoutes()}
            {JobseekerVerificationRoutes()}
          </Route>
        </Route>
      </Route>

      {/* Dashboard Routes (Login required, Verification handled inside pages) */}
      <Route element={<RoleRoute role={["client", "jobseeker", "admin"]} />}>
        {ClientRoutes()}
        {JobseekerRoutes()}
        {AdminRoutes()}
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}