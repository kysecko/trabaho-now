import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function ShellLayout({ title, links }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // NEW: Logout Modal State

  const bottomNavLinks = links.slice(0, 3);
  const drawerLinks = links.slice(3);

  const isRouteActive = (link) =>
    link.end
      ? pathname === link.to
      : pathname === link.to || pathname.startsWith(`${link.to}/`);

  const isPrimaryRoute = bottomNavLinks.some(isRouteActive);
  const isMoreActive = !isPrimaryRoute && links.some(isRouteActive);
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || "U";

  // Close menus on route change
  useEffect(() => {
    setIsMoreMenuOpen(false);
    setIsLogoutModalOpen(false);
  }, [pathname]);

  // Handle escape key and scroll lock for More Menu
  useEffect(() => {
    if (!isMoreMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsMoreMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMoreMenuOpen]);

  // Handle escape key and scroll lock for Logout Modal
  useEffect(() => {
    if (!isLogoutModalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsLogoutModalOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLogoutModalOpen]);

  const handleLogoutConfirm = async () => {
    setIsMoreMenuOpen(false);
    setIsLogoutModalOpen(false);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderIcon = (link, isActive, className = "h-5 w-5") => {
    const Icon = isActive && link.activeIcon ? link.activeIcon : link.icon;
    return <Icon className={className} aria-hidden="true" />;
  };

  const renderLink = (link, mobile = false) => (
    <NavLink
      key={link.to}
      to={link.to}
      end={link.end}
      onClick={() => setIsMoreMenuOpen(false)}
      aria-label={link.label}
      className={({ isActive }) =>
        mobile
          ? `flex h-full w-full min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 transition-colors ${
              isActive ? "text-[#ff4d00]" : "text-gray-400 hover:text-white"
            }`
          : `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#ff4d00] text-white shadow-lg shadow-orange-500/20"
                : "text-gray-300 hover:bg-[#2b2b40] hover:text-white"
            }`
      }
    >
      {({ isActive }) => (
        <>
          {renderIcon(link, isActive, mobile ? "h-6 w-6" : "h-5 w-5")}
          <span
            className={
              mobile
                ? "w-full truncate text-center text-[11px] font-medium leading-tight"
                : "min-w-0 flex-1"
            }
          >
            {mobile ? link.mobileLabel || link.label : link.label}
          </span>
        </>
      )}
    </NavLink>
  );

  const renderUserProfile = () => (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff4d00] text-sm font-bold text-white">
        {userInitial}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">
          {user?.name || "User"}
        </p>
        <p className="truncate text-xs capitalize text-gray-400">
          {user?.role || "Member"}
        </p>
      </div>
    </div>
  );

  const notificationPath = pathname.startsWith("/jobseeker")
    ? "/jobseeker/notifications"
    : "/client/notifications";

  return (
    <div className="relative flex h-dvh overflow-hidden bg-gray-50 font-sans text-gray-800">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[#2b2b40] bg-navy md:flex">
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#2b2b40] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ff4d00] font-bold text-white">
            T
          </div>
          <span className="text-lg font-bold tracking-wide text-[#ff4d00]">
            TRABAHONOW
          </span>
        </div>

        <nav aria-label="Main navigation" className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {links.map((link) => renderLink(link))}
        </nav>

        <div className="space-y-5 border-t border-[#2b2b40] p-5">
          {renderUserProfile()}

          {/* Trigger Modal instead of immediate logout */}
          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2b2b40] px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#3b3b55] hover:text-white"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* MAIN APPLICATION */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {/* TOP HEADER */}
        <header className="z-20 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <div className="min-w-0 md:hidden">
            <p className="truncate text-sm font-bold text-[#ff4d00]">
              TRABAHONOW
            </p>
            <p className="truncate text-xs text-gray-500">{title}</p>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(notificationPath)}
              aria-label="View notifications"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
            >
              <BellIcon className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 py-1 pl-1 pr-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff4d00] text-sm font-semibold text-white">
                {userInitial}
              </div>
              <span className="hidden max-w-36 truncate text-sm font-medium text-gray-700 sm:block">
                {user?.name || "User"}
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main
          id="main-content"
          className="bg-[#F7FAFC] min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:p-6 md:p-8"
        >
          <Outlet />
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(4rem+env(safe-area-inset-bottom))] grid-cols-4 border-t border-[#2b2b40] bg-navy px-1 pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {bottomNavLinks.map((link) => renderLink(link, true))}

        <button
          type="button"
          onClick={() => setIsMoreMenuOpen(true)}
          aria-label="Open more menu"
          aria-expanded={isMoreMenuOpen}
          aria-haspopup="dialog"
          className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 transition-colors ${
            isMoreActive || isMoreMenuOpen
              ? "text-[#ff4d00]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <EllipsisHorizontalIcon className="h-6 w-6" aria-hidden="true" />
          <span className="text-[11px] font-medium leading-tight">More</span>
        </button>
      </nav>

      {/* MORE DRAWER */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close menu"
            onClick={() => setIsMoreMenuOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-black/50"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="More menu"
            className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-navy shadow-2xl"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#2b2b40] px-5">
              <span className="font-bold tracking-wide text-[#ff4d00]">
                TRABAHONOW
              </span>
              <button
                type="button"
                autoFocus
                onClick={() => setIsMoreMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-gray-400 hover:bg-[#2b2b40] hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="border-b border-[#2b2b40] p-5">
              {renderUserProfile()}
            </div>

            <nav
              aria-label="More navigation options"
              className="flex-1 space-y-2 overflow-y-auto overscroll-contain px-4 py-5"
            >
              <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Menu
              </p>
              {drawerLinks.map((link) => renderLink(link))}
            </nav>

            <div className="shrink-0 border-t border-[#2b2b40] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              {/* Trigger Modal from Mobile Drawer */}
              <button
                type="button"
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2b2b40] px-4 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-[#3b3b55] hover:text-white"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Log out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* --- NEW: LOGOUT CONFIRMATION MODAL --- */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                Are you sure you want to log out? You will need to enter your credentials again to access your dashboard.
              </p>

              <div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="w-full rounded-xl border cursor-pointer border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="w-full rounded-xl bg-[#ff4d00] px-4 py-2.5 text-sm font-semibold cursor-pointer text-white shadow-sm transition-colors hover:bg-primary-hover sm:w-auto"
                >
                  Continue Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}