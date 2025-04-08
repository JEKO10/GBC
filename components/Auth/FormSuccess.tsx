import React from "react";

interface FormSuccessProps {
  message: string | undefined;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="text-center bg-green-700 tracking-wide p-3 rounded-md text-sm text-white">
      {message}
    </div>
  );
};

export default FormSuccess;
