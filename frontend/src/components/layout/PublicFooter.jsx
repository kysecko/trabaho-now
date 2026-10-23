import { Link } from "react-router-dom";
import Container from "./Container";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/jobseekers", label: "Find jobseekers" },
      { to: "/services", label: "Services" },
      { to: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Log in" },
      { to: "/signup", label: "Create an account" },
      { to: "/download", label: "Download the app" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy policy" },
      { to: "/terms", label: "Terms of use" },
      { to: "/help", label: "Help & support" },
    ],
  },
];

export default function PublicFooter() {
  return (
    <footer className="bg-navy text-navy-text">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-2xl font-extrabold tracking-tight text-white">
              Trabaho<span className="text-primary">Now</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              A local services marketplace for Sta. Maria, Bulacan. Find work
              for today, or hire for today.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} TrabahoNow. Sta. Maria, Bulacan.</span>
          <span>Built with the Data Privacy Act of 2012 (RA 10173) in mind.</span>
        </div>
      </Container>
    </footer>
  );
}