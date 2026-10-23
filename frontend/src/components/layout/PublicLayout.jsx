import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import PublicNavbar from "./PublicHeader";
import PublicFooter from "./PublicFooter";

export default function PublicLayout() {
  const { pathname } = useLocation();

  // Start every page at the top when the route changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <PublicNavbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <PublicFooter />
    </div>
  );
}