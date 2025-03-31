import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="h-full flex items-center justify-center px-5">
      {children}
    </div>
  );
};

export default AuthLayout;
