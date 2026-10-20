import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import RoleRoute from "../guards/RoleRoute";
import Placeholder from "../../components/shared/Placeholder";

// Import Admin Pages
import IdQueue from "../../pages/admin/IdQueue";

export default function AdminRoutes() {
  const P = (title) => <Placeholder title={title} />;

  return [
    <Route key="admin" element={<RoleRoute role="admin" />}>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="id-queue" replace />} />
        <Route path="id-queue" element={<IdQueue />} />
        <Route path="post-queue" element={P("Post queue")} />
        <Route path="cancellations" element={P("Cancellations")} />
        <Route path="reports" element={P("Reports")} />
      </Route>
    </Route>
  ];
}