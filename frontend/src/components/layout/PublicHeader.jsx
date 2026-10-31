import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useInstallPrompt from "../../hooks/useInstallPrompt";
import Container from "./Container";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const links = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/jobseekers", label: "Find Jobseekers" },
  { to: "/services", label: "Services" },
];

const linkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors hover:text-primary ${
    isActive ? "text-primary" : "text-ink"
  }`;

export default function PublicNavbar() {
  const { user } = useAuth();
  // 👇 Destructure canInstall too
  const { canInstall, installed, install } = useInstallPrompt();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);

  const handleDownload = async () => {
    close();
    if (canInstall) {
      // If Android/Chrome supports it, trigger the native prompt
      await install();
    } else {
      // If iOS or unsupported browser, take them to the instructions page
      navigate("/download");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-white shadow-card">
      <Container>
        <nav aria-label="Main" className="flex items-center gap-6 py-3">
          <Link
            to="/"
            onClick={close}
            className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl z-50 relative"
          >
            Trabaho<span className="text-primary">Now</span>
          </Link>

          {/* Hamburger (phones) */}
          <button
            type="button"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="ml-auto rounded-lg p-1.5 text-ink md:hidden z-50 relative"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          {/* Links + actions */}
          <div
            className={`${
              open ? "flex" : "hidden"
            } absolute left-0 right-0 top-full flex-col gap-4 border-b border-line bg-white px-4 py-5 shadow-card sm:px-6 md:static md:flex md:flex-1 md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          >
            <ul className="flex flex-col gap-4 md:mx-auto md:flex-row md:gap-8">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} onClick={close} className={linkClass}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-stretch gap-3 text-center md:flex-row md:items-center md:gap-5">
              <Link
                to={user ? `/${user.role}` : "/login"}
                onClick={close}
                className="inline-flex items-center justify-center rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-blue transition hover:bg-page"
              >
                {user ? "My account" : "Log in"}
              </Link>

              {!installed && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download App
                </button>
              )}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}