"use client";

export default function Input({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-md ${className}`}
        {...props}
      />
    </div>
  );
}