"use client";

export default function Button({
  type = "button",
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  isLoading = false,
}) {
  const baseStyles = "px-4 py-2 rounded-md transition-colors";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}