import React from "react";

const Button = ({
  type = "button",
  onClick,
  disabled = false,
  isLoading = false,
  loadingText = "Processing...",
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-opacity-50";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-500",
  };

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${
    disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""
  } ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedStyles}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
