import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const renderIcon = (icon) =>
  React.isValidElement(icon) ? icon : React.createElement(icon, { className: "w-4 h-4" });

export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  icon,
  rightIcon,
  autoComplete,
  as = "input", // "input" | "select"
  options = [], // for select: ["A", "B"] or [{ value, label }]
  placeholder,
  children, // custom control (e.g. upload box) replaces the input
  className = "",
  ...props
}) {
  const controlClass = `w-full h-10 rounded-lg border bg-white px-3 text-sm text-gray-800 placeholder:text-gray-400 ${
    icon ? "pl-10" : ""
  } ${rightIcon || as === "select" ? "pr-10" : ""} ${
    error ? "border-red-400" : "border-gray-300"
  } focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30`;

  let control = children;

  if (!children && as === "select") {
    const selectValueProps = value !== undefined ? { value } : { defaultValue: "" };
    control = (
      <select
        id={name}
        name={name}
        onChange={onChange}
        required={required}
        className={`${controlClass} appearance-none`}
        {...selectValueProps}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    );
  } else if (!children) {
    control = (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete ?? "off"}
        className={controlClass}
        {...props}
      />
    );
  }

  return (
    <div className={`min-w-0 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-navy mb-1.5">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && !children && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted pointer-events-none">
            {renderIcon(icon)}
          </span>
        )}

        {control}

        {as === "select" && !children && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDownIcon className="w-4 h-4 text-gray-800 stroke-3" />
          </span>
        )}

        {rightIcon && !children && as !== "select" && (
          <span className=" absolute inset-y-0 right-0 flex items-center pr-3">{rightIcon}</span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}