"use client";

import { useState } from 'react';

export default function Input({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  placeholder = "",
  className = "",
  error = null,
  icon = null,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium transition-colors duration-200 mb-1.5
            ${isFocused ? 'text-indigo-600' : 'text-gray-700'}
            ${error ? 'text-red-600' : ''}
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg border text-gray-900 placeholder-gray-400
            ${icon ? 'pl-10' : ''}
            ${isFocused ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-300'}
            ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
            ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition-all duration-200
            ${className}
          `}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}