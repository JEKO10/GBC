import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";

interface FormFieldProps {
  label: string;
  type: "text" | "email" | "password" | "checkbox" | "number";
  placeholder?: string;
  icon?: React.ReactNode;
  registration: ReturnType<UseFormRegister<any>>;
  error?: FieldError;
}

const FormField = ({
  label,
  type,
  placeholder = "",
  icon,
  registration,
  error,
}: FormFieldProps) => {
  const id = registration.name || `field-${Math.random()}`;

  return (
    <div className="flex flex-col w-full">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mb-0.5">
        {label}
      </label>
      <div
        className={`flex items-center bg-white border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg px-3 py-2 focus-within:border-primary`}
      >
        {icon && <span className="mr-2 text-gray-500">{icon}</span>}
        <input
          id={id}
          type={type}
          placeholder={type !== "checkbox" ? placeholder : undefined}
          className={
            type === "checkbox"
              ? "w-5 h-5 text-primary focus:ring-primary cursor-pointer"
              : "w-full outline-none bg-transparent"
          }
          {...registration}
        />
      </div>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error.message}</span>
      )}
    </div>
  );
};

export default FormField;
