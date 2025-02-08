import React from "react";
import { UseFormRegister } from "react-hook-form";

type FormFieldProps = {
  label: string;
  type: string;
  placeholder: string;
  icon?: React.ReactNode;
  registration: ReturnType<UseFormRegister<any>>;
};

const FormField = ({
  label,
  type,
  placeholder,
  icon,
  registration,
}: FormFieldProps) => {
  return (
    <label className="flex items-start justify-center flex-col w-full mb-3">
      <span className="mb-1.5 text-sm select-none">{label}</span>
      <div className="w-full flex items-center justify-center bg-body px-2 border-2 rounded-md focus-within:border-primary">
        {icon && <span className="text-[#8e8e8e] text-xl">{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          className="w-full px-2 py-1 bg-transparent rounded-md outline-none"
          {...registration}
        />
      </div>
    </label>
  );
};

export default FormField;
