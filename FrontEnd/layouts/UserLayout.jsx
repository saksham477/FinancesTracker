import React from "react";
import NavBar from "../src/components/Navbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
};

export default UserLayout;
