import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  Squares2X2Icon,
  UsersIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  BellIcon,
  CalendarDaysIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon, // Added for the modal
} from "@heroicons/react/24/outline";

// Solid Icons 
import {
  Squares2X2Icon as Squares2X2Solid,
  UsersIcon as UsersSolid,
  ShieldCheckIcon as ShieldCheckSolid,
  DocumentTextIcon as DocumentTextSolid,
  CreditCardIcon as CreditCardSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverSolid,
  ChartBarIcon as ChartBarSolid,
  Cog6ToothIcon as Cog6ToothSolid,
} from "@heroicons/react/24/solid";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // State for the logout confirmation modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const adminName = user?.name || "Admin User";
  const adminRole = user?.role || "Administrator";

  // nav links
  const adminLinks = [
    { to: "/admin", label: "Dashboard", icon: Squares2X2Icon, activeIcon: Squares2X2Solid, end: true },
    { to: "/admin/manage-users", label: "User Management", icon: UsersIcon, activeIcon: UsersSolid },
    { to: "/admin/verification", label: "Verification Queue", icon: ShieldCheckIcon, activeIcon: ShieldCheckSolid },
    { to: "/admin/transactions", label: "Transaction Logs", icon: DocumentTextIcon, activeIcon: DocumentTextSolid },
    { to: "/admin/credits", label: "Credit Management", icon: CreditCardIcon, activeIcon: CreditCardSolid },
    { to: "/admin/services", label: "Service Listings", icon: WrenchScrewdriverIcon, activeIcon: WrenchScrewdriverSolid },
    { to: "/admin/reports", label: "Reports", icon: ChartBarIcon, activeIcon: ChartBarSolid },
    { to: "/admin/settings", label: "System Settings", icon: Cog6ToothIcon, activeIcon: Cog6ToothSolid },
  ];

  // tab header indicator
  const getPageTitle = () => {
    if (pathname === "/admin" || pathname === "/admin/dashboard") return "Overview";
    if (pathname.includes("/manage-users")) return "User Management";
    if (pathname.includes("/verification")) return "Verification Queue";
    if (pathname.includes("/transactions")) return "Transaction Logs";
    if (pathname.includes("/credits")) return "Credit Management";
    if (pathname.includes("/services")) return "Service Listings";
    if (pathname.includes("/reports")) return "Reports";
    if (pathname.includes("/settings")) return "System Settings";
    return "Dashboard"; 
  };

  const currentDate = new Date().toISOString().split('T')[0];

  // Handle escape key to close the modal
  useEffect(() => {
    if (!isLogoutModalOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsLogoutModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isLogoutModalOpen]);

  // Actual logout execution
  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-admin-bg font-sans text-gray-800">

      {/* ADMIN SIDEBAR */}
      <aside className="hidden w-64 shrink-0 flex-col bg-admin-sidebar md:flex">

        {/* Logo Section */}
        <div className="flex h-20 shrink-0 items-center gap-3 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-admin-active font-bold text-white shadow-sm">
            <div className="flex flex-col items-center gap-0.5">
              <span className="h-0.5 w-4 bg-white rounded-full"></span>
              <span className="text-sm leading-none">T</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-white">
              TrabahoStaMaria
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-admin-text-muted">
              Admin Workspace
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
            Workspace
          </p>
          {adminLinks.map((link) => {
            const isActive = link.end
              ? pathname === link.to
              : pathname.startsWith(link.to);

            const Icon = isActive && link.activeIcon ? link.activeIcon : link.icon;

            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                  ? "bg-admin-active text-white"
                  : "text-gray-300 hover:bg-admin-sidebar-hover hover:text-white"
                  }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* BOTTOM SECTION: PROFILE & LOGOUT */}
        <div className="shrink-0 border-t border-[#1A2A45] p-4">

          {/* User Profile */}
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-admin-sidebar">
              {adminName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-white">
                {adminName}
              </span>
              <span className="truncate text-xs text-admin-text-muted capitalize">
                {adminRole}
              </span>
            </div>
          </div>

          {/* Logout Button - Now triggers the modal */}
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg bg-admin-sidebar hover:bg-[#1f3555] px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white border border-[#1A2A45] hover:border-transparent"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">

        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Admin workspace</span>
            <span>/</span>
            <span className="font-medium text-gray-900">{getPageTitle()}</span>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
              <span>{currentDate}</span>
            </div>

            <button className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <BellIcon className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-0 flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close modal"
            onClick={() => setIsLogoutModalOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <ExclamationTriangleIcon className="h-7 w-7 text-red-600" aria-hidden="true" />
              </div>

              <h3 id="logout-title" className="mt-4 text-lg font-bold text-gray-900">
                Log out of your account?
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to log out? You will need to enter your credentials again to access the admin dashboard.
              </p>

              <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false  )}
                  className="w-full rounded-xl cursor-pointer border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="w-full rounded-xl cursor-pointer bg-admin-active px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}