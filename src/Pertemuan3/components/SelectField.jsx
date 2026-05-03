export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
}) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 
        ${error ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-pink-200"}`}
      >
        <option value="">-- Pilih --</option>
        {options.map((opt, index) => (
          <option key={index} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {/* ERROR */}
      {error && (
        <div className="mt-1 text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}