import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicHeader";
import Container from "./Container";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <PublicNavbar />

      <main className="flex-1">
          <Outlet />
      </main>

      <footer className="border-t border-line bg-white py-4 text-center text-sm text-muted">
        <Container>© {new Date().getFullYear()} TrabahoNow</Container>
      </footer>
    </div>
  );
}