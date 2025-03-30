import React from "react";

export const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  options = [],
  placeholder = "",
  className = "",
  labelClassName = "",
  ...props
}) => {
  const inputClassName =
    "w-full p-2 border text-black rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <div className={className}>
      <label
        className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
      >
        {label}
      </label>

      {type === "select" ? (
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          className={inputClassName}
          {...props}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={inputClassName}
          rows="3"
          {...props}
        />
      ) : type === "checkbox" ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value || false}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            {...props}
          />
          <label htmlFor={name} className="ml-2 block text-sm text-gray-700">
            {label}
          </label>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={inputClassName}
          {...props}
        />
      )}
    </div>
  );
};

export default FormField;
