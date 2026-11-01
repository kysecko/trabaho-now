import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import VerificationLayout from "../components/layout/VerificationLayout"; // Ensure this exists

// Guards
import RoleRoute from "./guards/RoleRoute";

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

// Verification Pages
import ChooseRole from "../pages/verification/ChooseRole";
import VerifyStart from "../pages/verification/VerifyStart";
import VerifyIdentity from "../pages/verification/VerifyIdentity";
import VerifyPending from "../pages/verification/VerifyPending";

// Modular Route Functions
import ClientRoutes from "./routes/clientRoutes";
import JobseekerRoutes from "./routes/jobseekerRoutes";
import AdminRoutes from "./routes/adminRoutes";

// Error Pages
import NotFound from "../pages/404NotFound";

export default function AppRouter() {
  return (
    <Routes>
      {/* landing page */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/jobseekers" element={<Jobseekers />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/download" element={<Download />} />
      </Route>

      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Changed to /verify-email */}
        <Route path="/verify-email" element={<VerifyEmail />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Identity Verification Onboarding Flow */}
      <Route element={<RoleRoute role={["client", "jobseeker"]} />}>
        <Route element={<VerificationLayout />}>
          <Route path="/verify" element={<ChooseRole />} />
          <Route path="/verify/start" element={<VerifyStart />} />
          <Route path="/verify/identity" element={<VerifyIdentity />} />
          <Route path="/verify/pending" element={<VerifyPending />} />
        </Route>
      </Route>

      {/* Dashboard Routes (Login required, NO RequireVerified wrapper) */}
      <Route element={<RoleRoute role={["client", "jobseeker", "admin"]} />}>
        {ClientRoutes()}
        {JobseekerRoutes()}
        {AdminRoutes()}
      </Route>

      {/* error 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}