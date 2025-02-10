import React from "react";

import { currentUser } from "@/lib/auth";

const ProfilePage = async () => {
  const user = await currentUser();

  return (
    <div className="flex flex-col gap-10">
      {JSON.stringify(user)}

      <button>Two factor auth {user?.isTwoFactorEnabled ? "ON" : "OFF"}</button>
    </div>
  );
};

export default ProfilePage;
