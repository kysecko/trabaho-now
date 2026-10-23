import { Routes, Route } from "react-router-dom";
import Placeholder from "../components/shared/Placeholder";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import SharedLayout from "../components/layout/SharedLayout";

// Guards
import RoleRoute from "./guards/RoleRoute";
import UnverifiedRoute from "./guards/UnVerified";

// Public Pages
import Home from "../pages/public/Home";
import Jobseekers from "../pages/public/JobSeekers"; 
import Services from "../pages/public/Services"; 
import HowItWorks from "../pages/public/HowItWorks";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";

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
      {/* 1. PUBLIC: Accessible to everyone */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        {/* The three navbar tabs */}
        <Route path="/jobseekers" element={<Jobseekers />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

      </Route>

      {/* 2. AUTH: Login, Signup, Forgot Password */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Shared */}
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

      {/* 5. 404: Catch-all */}
      <Route path="*" element={<Placeholder title="Page not found" />} />
    </Routes>
  );
}