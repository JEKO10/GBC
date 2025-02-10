import React from "react";

import { currentRole } from "@/lib/auth";

const AdminPage = async () => {
  const role = await currentRole();

  return <div>Cureent role {role}</div>;
};

export default AdminPage;
