export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 
        ${error ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-pink-200"}`}
      />

      {/* ERROR */}
      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}