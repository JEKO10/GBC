"use client";

import { UserRole } from "@prisma/client";
import React, { ReactNode } from "react";

import { useCurrentRole } from "@/hooks/useCurrentRole";

import FormError from "./FormError";

interface RoleGate {
  children: ReactNode;
  allowedRole: UserRole;
}

const RoleGate = ({ children, allowedRole }: RoleGate) => {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return <FormError message="You are not authorized to visit this page!" />;
  }

  return <div>{children}</div>;
};

export default RoleGate;
