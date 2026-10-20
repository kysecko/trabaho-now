import { Route } from "react-router-dom";
import SharedLayout from "../../components/layout/SharedLayout";
import RoleRoute from "../guards/RoleRoute";
import Placeholder from "../../components/shared/Placeholder";

export default function SharedRoutes() {
  const P = (title) => <Placeholder title={title} />;

  return [
    <Route key="shared" element={<RoleRoute role={["client", "jobseeker"]} />}>
      <Route element={<SharedLayout />}>
        <Route path="/bookings/:id" element={P("Booking details")} />
        <Route path="/payments/:id" element={P("Payment status")} />
        <Route path="/bookings/:id/review" element={P("Rate and review")} />
        <Route path="/report" element={P("Report and block")} />
        <Route path="/settings" element={P("Settings")} />
        <Route path="/help" element={P("Help")} />
      </Route>
    </Route>
  ];
}