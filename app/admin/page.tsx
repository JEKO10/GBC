import React from "react";

import Discounts from "./components/Discounts";
import Offers from "./components/Offers";
import Posts from "./components/Posts";

const AdminPage = () => {
  return (
    <section className="px-10 text-center">
      <h2>AdminPage</h2>
      <Offers />
      <Discounts />
      <Posts />
    </section>
  );
};

export default AdminPage;
