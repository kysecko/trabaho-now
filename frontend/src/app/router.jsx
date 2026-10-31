import { Routes, Route } from "react-router-dom";
import Placeholder from "../components/ui/Placeholder";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";

// Guards
import RoleRoute from "./guards/RoleRoute";
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

// Modular Route Functions
import ClientRoutes from "./routes/clientRoutes";
import JobseekerRoutes from "./routes/jobseekerRoutes";
import AdminRoutes from "./routes/adminRoutes";

// 👇 CHANGE TO export default
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
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<RequireVerified />}>
        
        <Route element={<RoleRoute role={["client", "jobseeker"]} />}>
          {/* <Route path="/verify-identity" element={<VerifyIdentity />} /> */}
        </Route>

        {ClientRoutes()}
        {JobseekerRoutes()}
        {AdminRoutes()}
      </Route>

      {/* error 404 */}
      <Route path="*" element={<Placeholder title="Page not found" />} />
    </Routes>
  );
}