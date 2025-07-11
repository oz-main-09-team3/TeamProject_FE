export default function FormInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  min,
  max,
  className = "",
  children
}) {
  console.log("state.phone_number:", value);

  return (
    <div className={`flex-1 text-left w-full relative ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-lighttext dark:text-darkBg mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        min={min}
        max={max}
        className={`form-input w-full p-1.5 focus:p-2 transition-all duration-200 h-8 text-lighttext dark:text-darkBg placeholder:text-gray-500 dark:placeholder:text-gray-500 pr-10 ${
          error ? 'border-red-500' : ''
        }`}
      />
      {children && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">{children}</div>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 