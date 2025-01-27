import React from "react";

import Ads from "./components/Ads";
import Posts from "./components/Posts";

const AdminPage = () => {
  return (
    <section className="px-10 text-center">
      <h2>AdminPage</h2>
      <Ads />
      <Posts />
    </section>
  );
};

export default AdminPage;
