import { Route, Navigate } from "react-router-dom";
import JobseekerLayout from "../../components/layout/JobseekerLayout";
import RoleRoute from "../guards/RoleRoute";
import VerifiedRoute from "../guards/VerifiedRoute";

// Import Jobseeker Pages
import JobseekerDashboard from "../../pages/jobseeker/JobseekerDashboard";
import MyJobPost from "../../pages/jobseeker/MyJobPost";
import BookingRequests from "../../pages/jobseeker/BookingRequests"; 
import JobseekerTransactions from "../../pages/jobseeker/JobseekerTransactions";
import JobseekerReviews from "../../pages/jobseeker/JobseekerReviews";
import JobseekerSettings from "../../pages/jobseeker/JobseekerSettings";
import JobseekerHelp from "../../pages/jobseeker/JobseekerHelp";
import JobseekerNotifications from "../../pages/jobseeker/JobseekerNotifications";

export default function JobseekerRoutes() {
  return [
    <Route key="jobseeker" element={<RoleRoute role="jobseeker" />}>
      <Route element={<VerifiedRoute />}>
        <Route path="/jobseeker" element={<JobseekerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<JobseekerDashboard />} />
          <Route path="services" element={<MyJobPost />} />
          <Route path="requests" element={<BookingRequests />} />
          <Route path="transactions" element={<JobseekerTransactions />} />
          <Route path="reviews" element={<JobseekerReviews />} />
          <Route path="notifications" element={<JobseekerNotifications />} />
          <Route path="settings" element={<JobseekerSettings />} />
          <Route path="help" element={<JobseekerHelp />} />
        </Route>
      </Route>
    </Route>
  ];
}