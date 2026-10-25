import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import RoleRoute from "../guards/RoleRoute";

// Import Admin Pages
import AdminDashboard from "../../pages/admin/AdminDashboard";
import UserManagement from "../../pages/admin/UserManagement"; 
import VerificationQueue from "../../pages/admin/VerificationQueue";
import TransactionLogs from "../../pages/admin/TransactionLogs";
import CreditManagement from "../../pages/admin/CreditManagement";
import ServiceListings from "../../pages/admin/ServiceListings";
import Reports from "../../pages/admin/Reports";
import Settings from "../../pages/admin/Settings";

export default function AdminRoutes() {
  return [
    <Route key="admin" element={<RoleRoute role="admin" />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        
        <Route path="manage-users" element={<UserManagement />} />
        <Route path="verification" element={<VerificationQueue />} />
        <Route path="transactions" element={<TransactionLogs />} />
        <Route path="credits" element={<CreditManagement />} />
        <Route path="services" element={<ServiceListings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Placeholder for ones you haven't built yet */}
        <Route path="cancellations" element={<div>Cancellations</div>} />
        <Route path="notifications" element={<div>Notifications</div>} />
        <Route path="help" element={<div>Help</div>} />
        
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Route>
  ];
}