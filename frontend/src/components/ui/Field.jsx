export default function Field({ label, error, required, ...props }) {
  return (
    <label className="block mb-3">
      <span className="block mb-1 text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      
      <input
        {...props}
        required={required} 
        className={`w-full px-3 py-2 border rounded-md box-border focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      
      {error && (
        <small className="block mt-1 text-sm text-red-600">
          {error}
        </small>
      )}
    </label>
  );
}