import React from "react";

interface FormErrorProps {
  message: string | undefined;
}

const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="text-center bg-red-500 tracking-wide p-3 rounded-md text-sm text-white">
      {message}
    </div>
  );
};

export default FormError;
