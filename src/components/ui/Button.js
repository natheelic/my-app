"use client";

import { useState } from 'react';

export default function Button({
  type = "button",
  children,
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  isLoading = false,
  fullWidth = false,
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyles = "relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center";
  
  const variants = {
    primary: `bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
              ${isHovered ? 'shadow-lg shadow-indigo-500/30' : 'shadow-md shadow-indigo-500/20'}`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 
                ${isHovered ? 'shadow-md shadow-gray-400/20' : 'shadow-sm shadow-gray-400/10'}`,
    danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 
            ${isHovered ? 'shadow-lg shadow-red-500/30' : 'shadow-md shadow-red-500/20'}`,
    outline: `bg-transparent border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 
              ${isHovered ? 'shadow-md shadow-indigo-500/20' : ''}`,
  };
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${disabled || isLoading ? 'opacity-70 cursor-not-allowed' : 'transform hover:-translate-y-0.5'} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <span className="mr-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}