// app/routes/publicRoutes.jsx
import { Route } from "react-router-dom";
import PublicLayout from "../../components/layout/PublicLayout";
import AuthLayout from "../../components/layout/AuthLayout";

import Home from "../../pages/public/Home";
import HowItWorks from "../../pages/public/HowItWorks";
import Terms from "../../pages/public/Terms";
import ForJobSeekers from "../../pages/public/ForJobSeekers";
import About from "../../pages/public/About";
import Login from "../../pages/public/Login";
import Register from "../../pages/public/Register";

export default function PublicRoutes() {
  return (
    <>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/for-job-seekers" element={<ForJobSeekers />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </>
  );
}