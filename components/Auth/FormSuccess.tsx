import React from "react";

interface FormSuccessProps {
  message: string | undefined;
}

const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div className="bg-green-400/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-600">
      {message}
    </div>
  );
};

export default FormSuccess;
