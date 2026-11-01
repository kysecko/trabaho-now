import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function ProfileMenu({ user, items = [], onLogout }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const name = user?.name || "User";
  const role = user?.role || "Member";
  const initial = name.charAt(0).toUpperCase();

  // Close on outside click and Escape
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open profile menu"
        className={`flex items-center gap-2.5 rounded-full border py-1 pl-2 pr-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff4d00]/60 sm:pr-3 ${
          open
            ? "border-[#ff4d00]/40 bg-orange-50"
            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff4d00] text-sm font-semibold text-white">
          {initial}
        </span>

        <span className="hidden min-w-0 text-left leading-tight md:block">
          <span className="block max-w-36 truncate text-sm font-semibold text-gray-900">
            {name}
          </span>
          <span className="block max-w-36 truncate text-xs capitalize text-gray-500">
            {role}
          </span>
        </span>

        <ChevronDownIcon
          aria-hidden="true"
          className={`hidden h-4 w-4 text-gray-400 transition-transform duration-200 sm:block ${
            open ? "rotate-180 text-[#ff4d00]" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-900/10 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Identity */}
          <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-4 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff4d00] text-base font-bold text-white">
              {initial}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
              {user?.email && (
                <p className="truncate text-xs text-gray-500">{user.email}</p>
              )}
              <span className="mt-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium capitalize text-[#c23c00]">
                {role}
              </span>
            </div>
          </div>

          {/* Optional links */}
          {items.length > 0 && (
            <div className="p-1.5">
              {items.map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  {Icon && <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />}
                  {label}
                </Link>
              ))}
            </div>
          )}

          {/* Log out */}
          <div className="border-t border-gray-100 p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onLogout?.();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}