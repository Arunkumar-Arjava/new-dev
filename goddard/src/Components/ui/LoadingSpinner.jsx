import React from 'react';

/**
 * Reusable loading spinner component for authentication states
 */
export const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "large",
  fullScreen = true 
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8", 
    large: "h-12 w-12"
  };

  const containerClasses = fullScreen 
    ? "min-h-screen bg-gray-50 flex items-center justify-center"
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`animate-spin border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 ${sizeClasses[size]}`} />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;