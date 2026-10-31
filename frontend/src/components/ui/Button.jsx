
import React from "react";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm",

  secondary:
    "bg-primary-soft text-primary hover:bg-orange-100 focus:ring-primary",

  outline:
    "border border-primary bg-white text-primary hover:bg-primary-soft focus:ring-primary",

  danger:
    "bg-danger text-white hover:bg-red-700 focus:ring-danger",

  ghost:
    "bg-transparent text-primary hover:bg-primary-soft focus:ring-primary",
};

const sizes = {
  sm: "px-3 py-2 text-sm gap-2",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2.5",
  xl: "px-6 py-3.5 text-base gap-3",
};

export default function Button({
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        rounded-lg font-semibold
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        LeftIcon && <LeftIcon className="h-5 w-5 shrink-0" />
      )}

      <span>{loading ? "Please wait..." : children}</span>

      {!loading && RightIcon && (
        <RightIcon className="h-5 w-5 shrink-0" />
      )}
    </button>
  );
}
