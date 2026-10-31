import { Route, Navigate } from "react-router-dom";
import ClientLayout from "../../components/layout/ClientLayout";
import RoleRoute from "../guards/RoleRoute";
import VerifiedRoute from "../guards/VerifiedRoute"; 

// Import Client Pages
import ClientDashboard from "../../pages/client/ClientDashboard";
import FindJobseekers from "../../pages/client/FindJobseekers";
import RequestBookings from "../../pages/client/RequestBookings";
import ClientTransactions from "../../pages/client/ClientTransactions";
import ClientReviews from "../../pages/client/ClientReviews";
import ClientSettings from "../../pages/client/ClientSettings";
import ClientHelp from "../../pages/client/ClientHelp";
import ClientCredits from "../../pages/client/ClientCredits";
import ClientNotifications from "../../pages/client/ClientNotifications";
import JobseekerProfile from "../../pages/client/JobseekerProfile";

export default function ClientRoutes() {
  return [
    <Route path="/client" key="client" element={<RoleRoute role="client" />}>
      <Route element={<VerifiedRoute />}>
        <Route element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="search" element={<FindJobseekers />} />
          <Route path="bookings" element={<RequestBookings />} />
          <Route path="transactions" element={<ClientTransactions />} />
          <Route path="reviews" element={<ClientReviews />} />
          <Route path="credits" element={<ClientCredits />} />
          <Route path="notifications" element={<ClientNotifications />} />
          <Route path="settings" element={<ClientSettings />} />
          <Route path="help" element={<ClientHelp />} />
          
          {/* The dynamic route */}
          <Route path="jobseekers/:id" element={<JobseekerProfile />} />
        </Route>
      </Route>
    </Route>
  ];
}