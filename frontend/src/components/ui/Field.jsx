
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
  ...props
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-navy mb-1">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
            {icon}
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete ?? "off"}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm ${icon ? "pl-9" : ""} ${rightIcon ? "pr-10" : ""} ${error ? "border-red-400" : "border-gray-300"} focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
          {...props}
        />

        {rightIcon && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
