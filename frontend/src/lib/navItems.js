export const clientNav = [
  { to: "/client/search",        label: "Search Services" },
  { to: "/client/bookings",      label: "My Bookings", verified: true },
  { to: "/client/trust-profile", label: "Trust Profile" },
  { to: "/settings",             label: "Settings" },
];

export const jobseekerNav = [
  { to: "/jobseeker",               label: "Dashboard" },
  { to: "/jobseeker/services",      label: "My Services",      verified: true },
  { to: "/jobseeker/availability",  label: "Availability",     verified: true },
  { to: "/jobseeker/requests",      label: "Booking Requests", verified: true },
  { to: "/jobseeker/active-job",    label: "Active Job",       verified: true },
  { to: "/jobseeker/earnings",      label: "Earnings",         verified: true },
  { to: "/jobseeker/trust-profile", label: "Trust Profile" },
  { to: "/settings",                label: "Settings" },
];

export const visibleNav = (items, user) =>
  items.filter((i) => !i.verified || user?.is_verified);