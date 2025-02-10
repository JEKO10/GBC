import { UserRole } from "@prisma/client";
import React from "react";

import FormSuccess from "@/components/Auth/FormSuccess";
import RoleGate from "@/components/Auth/RoleGate";

const AdminPage = async () => {
  return (
    <div>
      <RoleGate allowedRole={UserRole.ADMIN}>
        <FormSuccess message="You are admin" />
        ALofoasf
      </RoleGate>
    </div>
  );
};

export default AdminPage;
